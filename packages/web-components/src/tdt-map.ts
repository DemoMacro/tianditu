import {
  applyMapInteractions,
  bindEventNames,
  createMapSession,
  MAP_EVENT_NAMES,
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

/** "lng,lat" 字符串 → [lng, lat] 数组；attribute 缺省时返回默认中心 */
export function lnglatConverter(value: string | null): [number, number] {
  if (!value) {
    return [116.404, 39.915];
  }
  const [lng, lat] = value.split(",").map(Number);
  return [lng, lat];
}

export class TdtMapElement extends LitElement {
  tk = "";

  center: [number, number] = [116.404, 39.915];

  zoom = 12;

  minZoom?: number;

  maxZoom?: number;

  private session?: MapSession;

  private ready?: Promise<T.Map>;

  private unbindEvents?: () => void;

  private prevCenter: [number, number] = [116.404, 39.915];

  private prevZoom = 12;

  /** 当前地图实例；SDK 就绪前为 undefined */
  get map(): T.Map | undefined {
    return this.session?.map;
  }

  static override properties = {
    tk: { type: String },
    center: { converter: lnglatConverter },
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
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
    });
    this.session = session;
    applyMapInteractions(session.map, {});
    // 官方事件以 tdt- 前缀转发为 DOM 事件，随销毁统一解绑
    this.unbindEvents = bindEventNames(session.map, MAP_EVENT_NAMES, (name, event) => {
      this.dispatchEvent(new CustomEvent(`tdt-${name}`, { detail: event, bubbles: true }));
    });
    return session.map;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.style.display = "block";
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
    const map = this.session?.map;
    if (!map) {
      return;
    }
    if (changed.has("center") && this.center && this.center !== this.prevCenter) {
      // SDK 无 setCenter，以当前级别 centerAndZoom 实现仅改中心
      map.centerAndZoom(new T.LngLat(this.center[0], this.center[1]), map.getZoom());
      this.prevCenter = [...this.center] as [number, number];
    }
    if (changed.has("zoom") && this.zoom !== this.prevZoom) {
      map.setZoom(this.zoom);
      this.prevZoom = this.zoom;
    }
  }

  override render() {
    // light DOM 渲染：lit-html 仅插入管理锚点，使用者的子元素保持原样
    return html``;
  }
}
