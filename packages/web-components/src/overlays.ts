import { compact, mountOverlay, type OverlayHandle, type SyncDef } from "@tianditu/core";
import { LitElement } from "lit";

import { lnglatConverter, type TdtMapElement } from "./tdt-map";

/**
 * 覆盖物元素工厂：与 vue 适配层同构的薄壳——attribute/property → core
 * mountOverlay 编排（构造挂载、props 同步、卸载清理），自身只做容器
 * 上下文解析与生命周期桥接。子元素写在 <tdt-map> 内部即自动挂载。
 */

interface OverlayElementConfig<P extends object, O> {
  /** 响应式属性 → 覆盖物 setter 的同步定义（经 core props-sync 生效） */
  sync?: SyncDef<O, P>;
  create(props: P): O;
}

abstract class OverlayElement<P extends object, O> extends LitElement {
  abstract readonly config: OverlayElementConfig<P, O>;

  protected abstract props(): P;

  private handle?: OverlayHandle<O>;

  override connectedCallback(): void {
    super.connectedCallback();
    const container = this.closest("tdt-map") as TdtMapElement | null;
    if (!container) {
      return;
    }
    container
      .whenReady()
      .then((map) => {
        if (this.handle || !this.isConnected) {
          return;
        }
        this.handle = mountOverlay(
          { map },
          {
            props: () => this.props(),
            sync: this.config.sync,
            // 实例由 create 携带全部 props 构造，首轮全量同步冗余
            create: () => this.config.create(this.props()),
            // 首批覆盖物元素不转发 SDK 事件
            dispatch: () => {},
          },
        );
      })
      .catch(() => {});
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.handle?.destroy();
    this.handle = undefined;
  }
}

export class TdtMarkerElement extends OverlayElement<{ lnglat: [number, number] }, T.Marker> {
  static override properties = {
    lnglat: { converter: lnglatConverter },
  };

  lnglat: [number, number] = [116.404, 39.915];

  readonly config = {
    sync: {
      lnglat: (marker: T.Marker, value: [number, number]) =>
        marker.setLngLat(new T.LngLat(value[0], value[1])),
    } satisfies SyncDef<T.Marker, { lnglat: [number, number] }>,
    create: (props: { lnglat: [number, number] }) =>
      new T.Marker(new T.LngLat(props.lnglat[0], props.lnglat[1])),
  };

  protected props() {
    return { lnglat: this.lnglat };
  }
}

export class TdtPolylineElement extends OverlayElement<
  { path: Array<[number, number]>; color?: string; weight?: number; opacity?: number },
  T.Polyline
> {
  static override properties = {
    path: { converter: pathConverter },
    color: { type: String },
    weight: { type: Number },
    opacity: { type: Number },
  };

  path: Array<[number, number]> = [];

  color?: string;

  weight?: number;

  opacity?: number;

  readonly config = {
    sync: {
      path: (polyline: T.Polyline, value: Array<[number, number]>) =>
        polyline.setLngLats(value.map(([lng, lat]) => new T.LngLat(lng, lat))),
    } satisfies SyncDef<T.Polyline, { path: Array<[number, number]> }>,
    create: (props: {
      path: Array<[number, number]>;
      color?: string;
      weight?: number;
      opacity?: number;
    }) =>
      new T.Polyline(
        props.path.map(([lng, lat]) => new T.LngLat(lng, lat)),
        compact({ color: props.color, weight: props.weight, opacity: props.opacity }),
      ),
  };

  protected props() {
    return { path: this.path, color: this.color, weight: this.weight, opacity: this.opacity };
  }
}

export class TdtCircleElement extends OverlayElement<
  { center: [number, number]; radius: number; fillColor?: string; fillOpacity?: number },
  T.Circle
> {
  static override properties = {
    center: { converter: lnglatConverter },
    radius: { type: Number },
    fillColor: { type: String },
    fillOpacity: { type: Number },
  };

  center: [number, number] = [116.404, 39.915];

  radius = 1000;

  fillColor?: string;

  fillOpacity?: number;

  readonly config = {
    create: (props: {
      center: [number, number];
      radius: number;
      fillColor?: string;
      fillOpacity?: number;
    }) =>
      new T.Circle(
        new T.LngLat(props.center[0], props.center[1]),
        props.radius,
        compact({ fillColor: props.fillColor, fillOpacity: props.fillOpacity }),
      ),
  };

  protected props() {
    return {
      center: this.center,
      radius: this.radius,
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
    };
  }
}

/** "lng,lat;lng,lat;…" 属性 → 坐标数组 */
function pathConverter(value: string | null): Array<[number, number]> {
  return (value ?? "")
    .split(";")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => lnglatConverter(pair));
}
