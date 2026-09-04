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
  destroy(): void;
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
  /** 初始中心点，允许以 [lng, lat] 数组表达 */
  center?: T.LngLat | [number, number];
  zoom?: number;
}

export async function createMapSession(
  el: HTMLElement,
  options: CreateMapSessionOptions,
): Promise<MapSession> {
  await loadTdt({ tk: options.tk, version: options.version, baseURL: options.baseURL });

  const map = new T.Map(el, {
    projection: options.projection,
    minZoom: options.minZoom,
    maxZoom: options.maxZoom,
    maxBounds: options.maxBounds,
    center: options.center ? toLngLat(options.center) : undefined,
    zoom: options.zoom,
  });
  const events = new EventBridge<T.MapEvents>(map);

  return {
    map,
    el,
    events,
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
