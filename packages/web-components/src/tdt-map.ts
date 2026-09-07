import {
  bindEventNames,
  createMapSession,
  MAP_EVENT_NAMES,
  parseLnglat,
  type MapSession,
} from "@tianditu/core";
import { LitElement, html, type PropertyValues } from "lit";

/**
 * 地图容器。light DOM 渲染（createRenderRoot 返回自身）：SDK 直接持有
 * 容器并挂载控件、覆盖物与窗体，shadow 边界会隔离 SDK 的样式与 DOM 操作。
 *
 * 子组件经 closest("tdt-map") 取容器、经 whenReady() 等待 SDK 就绪；
 * 地图事件以 `tdt-<官方事件名>` 的 CustomEvent 转发（detail 为 SDK 原生
 * 事件对象），避免与标准 DOM 事件同名混淆。
 */

/** "lng,lat" 字符串 → [lng, lat] 数组；attribute 不传时为 undefined（回退默认中心） */
export function lnglatConverter(value: string | null): [number, number] | undefined {
  return value ? parseLnglat(value) : undefined;
}

/**
 * 定位方式：attribute 不存在即关闭；空值（presence 写法 `locate`）或
 * "auto" 为自动模式（浏览器定位 → IP 定位），亦可显式写 "geolocation"/"ip"。
 */
export type LocateMode = boolean | "geolocation" | "ip" | "auto";

function locateConverter(value: string | null): LocateMode {
  if (value === null) {
    return false;
  }
  if (value === "") {
    return true;
  }
  return value as "geolocation" | "ip" | "auto";
}

export class TdtMapElement extends LitElement {
  tk = "";

  center?: [number, number];

  locate: LocateMode = false;

  zoom = 12;

  minZoom?: number;

  maxZoom?: number;

  private session?: MapSession;

  private ready?: Promise<T.Map>;

  private unbindEvents?: () => void;

  /** 当前地图实例；SDK 就绪前为 undefined */
  get map(): T.Map | undefined {
    return this.session?.map;
  }

  static override properties = {
    tk: { type: String },
    center: { converter: lnglatConverter },
    locate: { converter: locateConverter },
    zoom: { type: Number },
    minZoom: { type: Number },
    maxZoom: { type: Number },
  };

  override createRenderRoot(): HTMLElement {
    return this;
  }

  /** SDK 与地图实例就绪的 promise；子组件挂载前等待 */
  whenReady(): Promise<T.Map> {
    return (this.ready ??= this.init());
  }

  private async init(): Promise<T.Map> {
    const session = await createMapSession(this, {
      tk: this.tk,
      center: this.center,
      locate: this.locate,
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
    });
    this.session = session;
    // 官方事件以 tdt- 前缀转发为 DOM 事件，随销毁统一解绑
    this.unbindEvents = bindEventNames(session.map, MAP_EVENT_NAMES, (name, event) => {
      this.dispatchEvent(
        new CustomEvent(`tdt-${name}`, { detail: event, bubbles: true, composed: true }),
      );
    });
    return session.map;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // isolation 创建独立的 stacking context：SDK 内部控件层的高 z-index
    // 不会逃逸出地图容器，避免盖住宿主页面叠加的元素
    this.style.display = "block";
    this.style.isolation = "isolate";
    // 子组件在 SDK 加载完成前即挂载，此处触发加载使其并行等待
    if (this.tk) {
      void this.whenReady();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unbindEvents?.();
    this.unbindEvents = undefined;
    this.session?.destroy();
    this.session = undefined;
    this.ready = undefined;
  }

  override updated(changed: PropertyValues): void {
    const session = this.session;
    if (!session) {
      return;
    }
    if (changed.has("center") && this.center) {
      session.setCenter(this.center);
    }
    if (changed.has("zoom")) {
      session.map.setZoom(this.zoom);
    }
  }

  override render() {
    // light DOM 渲染：lit-html 仅插入管理锚点，使用者的子元素保持原样
    return html``;
  }
}
