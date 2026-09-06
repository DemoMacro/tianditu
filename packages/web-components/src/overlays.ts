import { compact, mountOverlay, type OverlayHandle, type SyncDef } from "@tianditu/core";
import { LitElement } from "lit";

import { lnglatConverter, type TdtMapElement } from "./tdt-map";

/**
 * 覆盖物元素工厂：与 vue 适配层同构的薄壳——attribute/property → core
 * mountOverlay 编排（构造挂载、props 同步、卸载清理），自身只做容器
 * 上下文解析与生命周期桥接。子元素写在 <tdt-map> 内部即自动挂载。
 * attribute 命名随官方 Options 字段（kebab-case）。
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

/** "w,h" 属性 → [width, height] */
function sizeConverter(value: string | null): [number, number] | undefined {
  if (!value) {
    return undefined;
  }
  const [w, h] = value.split(",").map(Number);
  return [w, h];
}

export class TdtMarkerElement extends OverlayElement<
  {
    lnglat: [number, number];
    icon?: T.IconOptions;
    draggable: boolean;
    title?: string;
    zIndexOffset?: number;
    opacity?: number;
  },
  T.Marker
> {
  static override properties = {
    lnglat: { converter: lnglatConverter },
    iconUrl: { type: String, attribute: "icon-url" },
    iconSize: { converter: sizeConverter, attribute: "icon-size" },
    iconAnchor: { converter: sizeConverter, attribute: "icon-anchor" },
    draggable: { type: Boolean },
    zIndexOffset: { type: Number, attribute: "z-index-offset" },
    opacity: { type: Number },
  };

  lnglat: [number, number] = [116.404, 39.915];

  iconUrl?: string;

  iconSize?: [number, number];

  iconAnchor?: [number, number];

  draggable = false;

  zIndexOffset?: number;

  opacity?: number;

  private iconOptions(): T.IconOptions | undefined {
    return this.iconUrl
      ? compact({
          iconUrl: this.iconUrl,
          iconSize: this.iconSize && new T.Point(this.iconSize[0], this.iconSize[1]),
          iconAnchor: this.iconAnchor && new T.Point(this.iconAnchor[0], this.iconAnchor[1]),
        })
      : undefined;
  }

  readonly config = {
    sync: {
      lnglat: (marker: T.Marker, value: [number, number]) =>
        marker.setLngLat(new T.LngLat(value[0], value[1])),
      icon: (marker: T.Marker, value?: T.IconOptions) => {
        if (value !== undefined) marker.setIcon(new T.Icon(value));
      },
      draggable: (marker: T.Marker, value: boolean) =>
        value ? marker.enableDragging() : marker.disableDragging(),
      opacity: (marker: T.Marker, value?: number) => {
        if (value !== undefined) marker.setOpacity(value);
      },
      zIndexOffset: (marker: T.Marker, value?: number) => {
        if (value !== undefined) marker.setZIndexOffset(value);
      },
    } satisfies SyncDef<
      T.Marker,
      {
        lnglat: [number, number];
        icon?: T.IconOptions;
        draggable: boolean;
        opacity?: number;
        zIndexOffset?: number;
      }
    >,
    create: (props: {
      lnglat: [number, number];
      icon?: T.IconOptions;
      draggable: boolean;
      title?: string;
      zIndexOffset?: number;
      opacity?: number;
    }) =>
      new T.Marker(
        new T.LngLat(props.lnglat[0], props.lnglat[1]),
        compact({
          icon: props.icon && new T.Icon(props.icon),
          draggable: props.draggable,
          title: props.title,
          zIndexOffset: props.zIndexOffset,
          opacity: props.opacity,
        }),
      ),
  };

  protected props() {
    return {
      lnglat: this.lnglat,
      icon: this.iconOptions(),
      draggable: this.draggable,
      title: this.title || undefined,
      zIndexOffset: this.zIndexOffset,
      opacity: this.opacity,
    };
  }
}

export class TdtPolylineElement extends OverlayElement<
  {
    path: Array<[number, number]>;
    color?: string;
    weight?: number;
    opacity?: number;
    lineStyle?: "solid" | "dashed";
  },
  T.Polyline
> {
  static override properties = {
    path: { converter: pathConverter },
    color: { type: String },
    weight: { type: Number },
    opacity: { type: Number },
    lineStyle: { type: String, attribute: "line-style" },
  };

  path: Array<[number, number]> = [];

  color?: string;

  weight?: number;

  opacity?: number;

  lineStyle?: "solid" | "dashed";

  readonly config = {
    sync: {
      path: (polyline: T.Polyline, value: Array<[number, number]>) =>
        polyline.setLngLats(value.map(([lng, lat]) => new T.LngLat(lng, lat))),
      color: (polyline: T.Polyline, value?: string) => {
        if (value !== undefined) polyline.setColor(value);
      },
      weight: (polyline: T.Polyline, value?: number) => {
        if (value !== undefined) polyline.setWeight(value);
      },
      opacity: (polyline: T.Polyline, value?: number) => {
        if (value !== undefined) polyline.setOpacity(value);
      },
      lineStyle: (polyline: T.Polyline, value?: "solid" | "dashed") => {
        if (value !== undefined) polyline.setLineStyle(value);
      },
    } satisfies SyncDef<
      T.Polyline,
      {
        path: Array<[number, number]>;
        color?: string;
        weight?: number;
        opacity?: number;
        lineStyle?: "solid" | "dashed";
      }
    >,
    create: (props: {
      path: Array<[number, number]>;
      color?: string;
      weight?: number;
      opacity?: number;
      lineStyle?: "solid" | "dashed";
    }) =>
      new T.Polyline(
        props.path.map(([lng, lat]) => new T.LngLat(lng, lat)),
        compact({
          color: props.color,
          weight: props.weight,
          opacity: props.opacity,
          lineStyle: props.lineStyle,
        }),
      ),
  };

  protected props() {
    return {
      path: this.path,
      color: this.color,
      weight: this.weight,
      opacity: this.opacity,
      lineStyle: this.lineStyle,
    };
  }
}

export class TdtCircleElement extends OverlayElement<
  {
    center: [number, number];
    radius: number;
    color?: string;
    weight?: number;
    opacity?: number;
    lineStyle?: "solid" | "dashed";
    fillColor?: string;
    fillOpacity?: number;
  },
  T.Circle
> {
  static override properties = {
    center: { converter: lnglatConverter },
    radius: { type: Number },
    color: { type: String },
    weight: { type: Number },
    opacity: { type: Number },
    lineStyle: { type: String, attribute: "line-style" },
    fillColor: { type: String, attribute: "fill-color" },
    fillOpacity: { type: Number, attribute: "fill-opacity" },
  };

  center: [number, number] = [116.404, 39.915];

  radius = 1000;

  color?: string;

  weight?: number;

  opacity?: number;

  lineStyle?: "solid" | "dashed";

  fillColor?: string;

  fillOpacity?: number;

  readonly config = {
    sync: {
      center: (circle: T.Circle, value: [number, number]) =>
        circle.setCenter(new T.LngLat(value[0], value[1])),
      radius: (circle: T.Circle, value: number) => circle.setRadius(value),
      color: (circle: T.Circle, value?: string) => {
        if (value !== undefined) circle.setColor(value);
      },
      weight: (circle: T.Circle, value?: number) => {
        if (value !== undefined) circle.setWeight(value);
      },
      opacity: (circle: T.Circle, value?: number) => {
        if (value !== undefined) circle.setOpacity(value);
      },
      lineStyle: (circle: T.Circle, value?: "solid" | "dashed") => {
        if (value !== undefined) circle.setLineStyle(value);
      },
      fillColor: (circle: T.Circle, value?: string) => {
        if (value !== undefined) circle.setFillColor(value);
      },
      fillOpacity: (circle: T.Circle, value?: number) => {
        if (value !== undefined) circle.setFillOpacity(value);
      },
    } satisfies SyncDef<
      T.Circle,
      {
        center: [number, number];
        radius: number;
        color?: string;
        weight?: number;
        opacity?: number;
        lineStyle?: "solid" | "dashed";
        fillColor?: string;
        fillOpacity?: number;
      }
    >,
    create: (props: {
      center: [number, number];
      radius: number;
      color?: string;
      weight?: number;
      opacity?: number;
      lineStyle?: "solid" | "dashed";
      fillColor?: string;
      fillOpacity?: number;
    }) =>
      new T.Circle(
        new T.LngLat(props.center[0], props.center[1]),
        props.radius,
        compact({
          color: props.color,
          weight: props.weight,
          opacity: props.opacity,
          lineStyle: props.lineStyle,
          fillColor: props.fillColor,
          fillOpacity: props.fillOpacity,
        }),
      ),
  };

  protected props() {
    return {
      center: this.center,
      radius: this.radius,
      color: this.color,
      weight: this.weight,
      opacity: this.opacity,
      lineStyle: this.lineStyle,
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
    };
  }
}

export class TdtCloudMarkerElement extends OverlayElement<
  { lnglats: Array<[number, number]>; styles?: T.CloudMarkerCollectionOptions },
  T.CloudMarkerCollection
> {
  static override properties = {
    lnglats: { converter: pathConverter },
    shape: { type: String },
    size: { type: String },
    color: { type: String },
  };

  lnglats: Array<[number, number]> = [];

  shape?: string;

  size?: string;

  color?: string;

  /** attribute 字符串 → 官方选项枚举值（ShapeType/SizeType 为 SDK 侧原样字符串） */
  private styles(): T.CloudMarkerCollectionOptions {
    return compact({
      ShapeType: this.shape as T.CloudMarkerCollectionOptions["ShapeType"],
      SizeType: this.size as T.CloudMarkerCollectionOptions["SizeType"],
      color: this.color,
    });
  }

  readonly config = {
    sync: {
      lnglats: (collection: T.CloudMarkerCollection, value: Array<[number, number]>) =>
        collection.setLnglats(value.map(([lng, lat]) => new T.LngLat(lng, lat))),
    } satisfies SyncDef<T.CloudMarkerCollection, { lnglats: Array<[number, number]> }>,
    create: (props: {
      lnglats: Array<[number, number]>;
      styles?: T.CloudMarkerCollectionOptions;
    }) =>
      new T.CloudMarkerCollection(
        props.lnglats.map(([lng, lat]) => new T.LngLat(lng, lat)),
        props.styles ?? {},
      ),
  };

  protected props() {
    return { lnglats: this.lnglats, styles: this.styles() };
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
