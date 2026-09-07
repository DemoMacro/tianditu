import { compact } from "./compact";
import { EventBridge } from "./events";
import { loadTdt } from "./loader";

/**
 * 地图会话：一个容器元素内 `T.Map` 实例的完整生命周期。
 * 天地图 4.0 没有正规的销毁 API，destroy 做的是尽最大努力的资源回收。
 */

export interface MapSession {
  map: T.Map;
  el: HTMLElement;
  /** 地图事件桥，随 destroy 统一解绑 */
  events: EventBridge<T.MapEvents>;
  /** 仅改中心：SDK 无 setCenter，以当前级别 centerAndZoom 实现 */
  setCenter(center: T.LngLat | [number, number]): void;
  destroy(): void;
}

/** 官方示例通用的默认中心（北京）与级别 */
export const DEFAULT_CENTER: [number, number] = [116.404, 39.915];

/** 各级定位的最长等待 */
const LOCATE_TIMEOUT = 3_000;

/** 官方 IP 定位接口，返回 {code, data: {lng, lat, city, level}}，CORS 全开 */
const IP_LOCATE_URL = "https://location.tianditu.gov.cn/data/getCityName";

interface IpLocateResponse {
  code: number;
  data?: { lng?: string | number; lat?: string | number };
}

/**
 * 浏览器定位（高精度）。locate 为显式开启的选项，触发浏览器的授权请求
 * 属预期语义；拒绝、失败或超时回退 undefined 交由 IP 定位兜底。
 */
function locateByGeolocation(): Promise<[number, number] | undefined> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve([position.coords.longitude, position.coords.latitude]),
      () => resolve(undefined),
      { timeout: LOCATE_TIMEOUT, maximumAge: 600_000 },
    );
  });
}

/**
 * 官方 IP 定位（城市级精度、无需授权），失败或超时回退 undefined。
 *
 * 不走 SDK 的 T.LocalCity：其内部为 JSONP 实现（script 注入
 * location.tianditu.gov.cn/data/getCityName?callback=query），而该端点已
 * 改版为返回裸 JSON 且字段更名（lon/lat → data.lng/data.lat），SDK 的
 * 回调因此永远不会触发，定位静默失效。
 */
async function locateByIp(): Promise<[number, number] | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LOCATE_TIMEOUT);
    const response = await fetch(IP_LOCATE_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) {
      return undefined;
    }
    const result = (await response.json()) as IpLocateResponse;
    const lng = Number(result.data?.lng);
    const lat = Number(result.data?.lat);
    return result.code === 200 && Number.isFinite(lng) && Number.isFinite(lat)
      ? [lng, lat]
      : undefined;
  } catch {
    return undefined;
  }
}

/** 默认中心：按模式定位，各级失败逐级回退至 DEFAULT_CENTER */
async function resolveDefaultCenter(
  mode: "geolocation" | "ip" | "auto",
): Promise<T.LngLat | [number, number]> {
  if (mode !== "ip") {
    const located = await locateByGeolocation();
    if (located) {
      return located;
    }
  }
  if (mode !== "geolocation") {
    const located = await locateByIp();
    if (located) {
      return located;
    }
  }
  return DEFAULT_CENTER;
}

export interface CreateMapSessionOptions {
  tk: string;
  version?: string;
  baseURL?: string;
  /** 地图投影 */
  projection?: string;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: T.LngLatBounds;
  /** 初始中心点，允许以 [lng, lat] 数组表达；不传时回退北京，locate 开启时定位用户位置（计入 JavaScriptApi 配额） */
  center?: T.LngLat | [number, number];
  /**
   * center 不传时的定位方式；默认 false（回退北京，零定位调用）。
   * - "geolocation"：仅浏览器定位（触发授权请求、高精度）
   * - "ip"：仅官方 IP 定位（城市级）
   * - "auto" 或 true：优先浏览器定位，失败回退 IP 定位
   */
  locate?: boolean | "geolocation" | "ip" | "auto";
  zoom?: number;
}

export async function createMapSession(
  el: HTMLElement,
  options: CreateMapSessionOptions,
): Promise<MapSession> {
  await loadTdt({ tk: options.tk, version: options.version, baseURL: options.baseURL });

  const locate = options.locate;
  const center = toLngLat(
    options.center ??
      (locate ? await resolveDefaultCenter(locate === true ? "auto" : locate) : DEFAULT_CENTER),
  );
  const zoom = options.zoom ?? 12;
  const map = new T.Map(
    el,
    compact({
      projection: options.projection,
      minZoom: options.minZoom,
      maxZoom: options.maxZoom,
      maxBounds: options.maxBounds,
      center,
      zoom,
    }),
  );
  // 官方约定：new T.Map 后必须显式 centerAndZoom 完成初始化，
  // 否则地图未就绪，addControl 等操作会直接报错。
  map.centerAndZoom(center, zoom);
  const events = new EventBridge<T.MapEvents>(map);

  return {
    map,
    el,
    events,
    setCenter(value) {
      map.centerAndZoom(toLngLat(value), map.getZoom());
    },
    destroy() {
      events.destroy();
      map.clearOverLays();
      map.clearLayers();
      el.innerHTML = "";
    },
  };
}

export function toLngLat(value: T.LngLat | [number, number]): T.LngLat {
  return Array.isArray(value) ? new T.LngLat(value[0], value[1]) : value;
}

export function toLngLats(value: Array<T.LngLat | [number, number]>): T.LngLat[] {
  return value.map(toLngLat);
}
