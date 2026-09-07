import { compact } from "../compact";
import type { SyncDef } from "../props-sync";
import { toLngLat, toLngLats } from "../session";
import { parseBounds, parseJson, parseLnglat, parsePath } from "./converters";
import type { OverlayDef, PropDefs } from "./types";

/**
 * 覆盖物定义。逐个从 vue 适配层迁移：props 形状、SDK 构造、sync 与事件表
 * 是 vue/wc 共同的唯一来源。sync 的风格统一为「undefined 不触发 setter」，
 * 与 SDK setter 对 undefined 敏感的行为对齐。
 */

export interface MarkerProps {
  lnglat: [number, number] | T.LngLat;
  /** 标注图标：官方 Icon 实例或 IconOptions（iconUrl/iconSize/iconAnchor） */
  icon?: T.Icon | T.IconOptions;
  draggable?: boolean;
  title?: string;
  zIndexOffset?: number;
  opacity?: number;
}

function toIcon(value: T.Icon | T.IconOptions): T.Icon {
  return value instanceof T.Icon ? value : new T.Icon(value);
}

export const markerDef: OverlayDef<MarkerProps, T.Marker> = {
  name: "TdtMarker",
  tag: "tdt-marker",
  props: {
    lnglat: { type: Array, required: true, attribute: "lnglat", converter: parseLnglat },
    icon: { type: Object, default: undefined, attribute: "icon", converter: parseJson },
    draggable: { type: Boolean, default: false, attribute: "draggable" },
    title: { type: String, default: undefined, attribute: "title" },
    zIndexOffset: { type: Number, default: undefined, attribute: "z-index-offset" },
    opacity: { type: Number, default: undefined, attribute: "opacity" },
  },
  events: [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mouseover",
    "mouseout",
    "dragstart",
    "drag",
    "dragend",
    "remove",
  ],
  // 挂载/卸载走 core 默认编排：collector 存在时加入聚合，否则 addOverLay
  create: (props) =>
    new T.Marker(
      toLngLat(props.lnglat),
      compact({
        icon: props.icon && toIcon(props.icon),
        draggable: props.draggable,
        title: props.title,
        zIndexOffset: props.zIndexOffset,
        opacity: props.opacity,
      }),
    ),
  sync: {
    lnglat: (marker, value) => marker.setLngLat(toLngLat(value)),
    icon: (marker, value) => {
      if (value !== undefined) marker.setIcon(toIcon(value));
    },
    draggable: (marker, value) =>
      value === false ? marker.disableDragging() : marker.enableDragging(),
    opacity: (marker, value) => {
      if (value !== undefined) marker.setOpacity(value);
    },
    zIndexOffset: (marker, value) => {
      if (value !== undefined) marker.setZIndexOffset(value);
    },
  },
};

export interface LineStyleProps {
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
}

/** 线样式四件套的 props 定义（polyline/polygon/rectangle/线型工具共用） */
export const lineStylePropDefs: PropDefs<LineStyleProps> = {
  color: { type: String, default: undefined, attribute: "color" },
  weight: { type: Number, default: undefined, attribute: "weight" },
  opacity: { type: Number, default: undefined, attribute: "opacity" },
  lineStyle: { type: String, default: undefined, attribute: "line-style" },
};

/** 具备线样式 setter 的 SDK 实例（Polyline/Polygon/Rectangle/Circle 同构） */
type LineStyleSetter = Pick<T.Polyline, "setColor" | "setWeight" | "setOpacity" | "setLineStyle">;

/** 线样式 setter 同步（polyline/polygon/rectangle/circle 同构复用） */
export const lineStyleSync: SyncDef<LineStyleSetter, LineStyleProps> = {
  color: (target, value) => {
    if (value !== undefined) target.setColor(value);
  },
  weight: (target, value) => {
    if (value !== undefined) target.setWeight(value);
  },
  opacity: (target, value) => {
    if (value !== undefined) target.setOpacity(value);
  },
  lineStyle: (target, value) => {
    if (value !== undefined) target.setLineStyle(value);
  },
};

export interface PolylineProps extends LineStyleProps {
  path: Array<[number, number] | T.LngLat>;
}

/** 填充两件套的 props 定义（polygon/circle/rectangle 共用） */
interface FillStyleProps {
  fillColor?: string;
  fillOpacity?: number;
}

const fillStylePropDefs = {
  fillColor: { type: String, default: undefined, attribute: "fill-color" },
  fillOpacity: { type: Number, default: undefined, attribute: "fill-opacity" },
} as const;

/** 具备填充 setter 的 SDK 实例（Polygon/Circle/Rectangle 同构） */
type FillStyleSetter = Pick<T.Polygon, "setFillColor" | "setFillOpacity">;

/** 填充 setter 同步（polygon/circle/rectangle 同构复用） */
const fillStyleSync: SyncDef<FillStyleSetter, { fillColor?: string; fillOpacity?: number }> = {
  fillColor: (target, value) => {
    if (value !== undefined) target.setFillColor(value);
  },
  fillOpacity: (target, value) => {
    if (value !== undefined) target.setFillOpacity(value);
  },
};

export const polylineDef: OverlayDef<PolylineProps, T.Polyline> = {
  name: "TdtPolyline",
  tag: "tdt-polyline",
  props: {
    path: { type: Array, required: true, attribute: "path", converter: parsePath },
    ...lineStylePropDefs,
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"],
  create(props) {
    return new T.Polyline(
      toLngLats(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    );
  },
  sync: {
    path: (polyline, value) => polyline.setLngLats(toLngLats(value)),
    ...lineStyleSync,
  },
};

export interface PolygonProps extends LineStyleProps, FillStyleProps {
  path: Array<[number, number] | T.LngLat>;
}

export const polygonDef: OverlayDef<PolygonProps, T.Polygon> = {
  name: "TdtPolygon",
  tag: "tdt-polygon",
  props: {
    path: { type: Array, required: true, attribute: "path", converter: parsePath },
    ...lineStylePropDefs,
    ...fillStylePropDefs,
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"],
  create(props) {
    return new T.Polygon(
      toLngLats(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    );
  },
  sync: {
    path: (polygon, value) => polygon.setLngLats(toLngLats(value)),
    ...lineStyleSync,
    ...fillStyleSync,
  },
};

export interface CircleProps extends LineStyleProps, FillStyleProps {
  center: [number, number] | T.LngLat;
  /** 半径，单位米 */
  radius: number;
}

export const circleDef: OverlayDef<CircleProps, T.Circle> = {
  name: "TdtCircle",
  tag: "tdt-circle",
  props: {
    center: { type: Array, required: true, attribute: "center", converter: parseLnglat },
    radius: { type: Number, required: true, attribute: "radius" },
    ...lineStylePropDefs,
    ...fillStylePropDefs,
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"],
  create(props) {
    return new T.Circle(
      toLngLat(props.center),
      props.radius,
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    );
  },
  sync: {
    center: (circle, value) => circle.setCenter(toLngLat(value)),
    radius: (circle, value) => circle.setRadius(value),
    ...lineStyleSync,
    ...fillStyleSync,
  },
};

export interface RectangleProps extends LineStyleProps, FillStyleProps {
  /** 西南角与东北角坐标 [[swLng, swLat], [neLng, neLat]] */
  bounds: [[number, number], [number, number]] | T.LngLatBounds;
}

function toBounds(value: RectangleProps["bounds"]): T.LngLatBounds {
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}

export const rectangleDef: OverlayDef<RectangleProps, T.Rectangle> = {
  name: "TdtRectangle",
  tag: "tdt-rectangle",
  props: {
    bounds: { type: Array, required: true, attribute: "bounds", converter: parseBounds },
    ...lineStylePropDefs,
    ...fillStylePropDefs,
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"],
  create(props) {
    return new T.Rectangle(
      toBounds(props.bounds),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    );
  },
  sync: {
    bounds: (rectangle, value) => rectangle.setBounds(toBounds(value)),
    ...lineStyleSync,
    ...fillStyleSync,
  },
};

export interface LabelProps {
  text: string;
  lnglat: [number, number] | T.LngLat;
  /** 文本偏移（官方 LabelOptions.offset） */
  offset?: T.Point;
  /** 字体颜色（官方 Label 方法 setFontColor） */
  fontColor?: string;
  /** 字体大小（像素，官方 Label 方法 setFontSize） */
  fontSize?: number;
  backgroundColor?: string;
  /** 提示内容（title） */
  title?: string;
}

export const labelDef: OverlayDef<LabelProps, T.Label> = {
  name: "TdtLabel",
  tag: "tdt-label",
  props: {
    text: { type: String, required: true, attribute: "text" },
    lnglat: { type: Array, required: true, attribute: "lnglat", converter: parseLnglat },
    offset: { type: Object, default: undefined, attribute: "offset", converter: parseJson },
    fontColor: { type: String, default: undefined, attribute: "font-color" },
    fontSize: { type: Number, default: undefined, attribute: "font-size" },
    backgroundColor: { type: String, default: undefined, attribute: "background-color" },
    title: { type: String, default: undefined, attribute: "title" },
  },
  // 官方 Label 事件表：click/dblclick/mousedown/mouseout/mouseup
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseout"],
  create(props) {
    const label = new T.Label(
      compact({
        text: props.text,
        position: toLngLat(props.lnglat),
        offset: props.offset,
      }),
    );
    if (props.fontColor) label.setFontColor(props.fontColor);
    if (props.fontSize) label.setFontSize(props.fontSize);
    if (props.backgroundColor) label.setBackgroundColor(props.backgroundColor);
    if (props.title) label.setTitle(props.title);
    return label;
  },
  sync: {
    text: (label, value) => label.setLabel(value),
    lnglat: (label, value) => label.setLngLat(toLngLat(value)),
    offset: (label, value) => {
      if (value !== undefined) label.setOffset(value);
    },
    fontColor: (label, value) => {
      if (value !== undefined) label.setFontColor(value);
    },
    fontSize: (label, value) => {
      if (value !== undefined) label.setFontSize(value);
    },
    backgroundColor: (label, value) => {
      if (value !== undefined) label.setBackgroundColor(value);
    },
    title: (label, value) => {
      if (value !== undefined) label.setTitle(value);
    },
  },
};

export interface CloudMarkerProps {
  /** 海量点的坐标集合 */
  lnglats: Array<T.LngLat | [number, number]>;
  /** 绘制样式（官方 CloudMarkerCollectionOptions：ShapeType/SizeType/color） */
  styles?: T.CloudMarkerCollectionOptions;
}

export const cloudMarkerDef: OverlayDef<CloudMarkerProps, T.CloudMarkerCollection> = {
  name: "TdtCloudMarker",
  tag: "tdt-cloud-marker",
  props: {
    lnglats: { type: Array, required: true, attribute: "lnglats", converter: parsePath },
    styles: { type: Object, default: undefined, attribute: "styles", converter: parseJson },
  },
  events: ["click", "mouseover", "mouseout"],
  create: (props) => new T.CloudMarkerCollection(props.lnglats.map(toLngLat), props.styles ?? {}),
  sync: {
    lnglats: (collection, value) => collection.setLnglats(value.map(toLngLat)),
    styles: (collection, value) => {
      if (value) {
        // SDK 的 setStyles 不可用，经全局 setOptions 更新样式选项
        T.setOptions(collection, value);
      }
    },
  },
};

export interface MarkerClustererProps {
  /** 批量传入的待聚合标注（官方 MarkerClustererOptions.markers） */
  markers?: Array<T.Marker | [number, number]>;
  /** 聚合计算网格的像素大小，默认 60（SDK 拼写为 girdSize） */
  gridSize?: number;
  /** 大于该级别不进行聚合 */
  maxZoom?: number;
  styles?: T.MarkerClustererStyle[];
}

function toMarkers(value: NonNullable<MarkerClustererProps["markers"]>): T.Marker[] {
  return value.map((item) =>
    Array.isArray(item) ? new T.Marker(toLngLat(item)) : (item as T.Marker),
  );
}

export const markerClustererDef: OverlayDef<MarkerClustererProps, T.MarkerClusterer> = {
  name: "TdtMarkerCluster",
  tag: "tdt-marker-clusterer",
  props: {
    markers: { type: Array, default: undefined },
    gridSize: { type: Number, default: undefined, attribute: "grid-size" },
    maxZoom: { type: Number, default: undefined, attribute: "max-zoom" },
    styles: { type: Array, default: undefined, attribute: "styles", converter: parseJson },
  },
  // 官方 MarkerClusterer 页未列事件表；个别交互事件可经 expose 的
  // cluster 实例用官方 addEventListener 命令式挂接
  // 点聚合在 SDK 内自行管理展示，不走 removeOverLay
  detach(cluster) {
    cluster.clearMarkers();
  },
  create(props, { map }) {
    const cluster = new T.MarkerClusterer(
      map,
      compact({
        girdSize: props.gridSize,
        maxZoom: props.maxZoom,
        styles: props.styles,
      }),
    );
    if (props.markers?.length) {
      cluster.addMarkers(toMarkers(props.markers));
    }
    return cluster;
  },
  sync: {
    markers: (cluster, value) => {
      if (value) {
        // 官方无整体替换方法：清空后重建
        cluster.clearMarkers();
        cluster.addMarkers(toMarkers(value));
      }
    },
    gridSize: (cluster, value) => {
      if (value !== undefined) cluster.setGridSize(value);
    },
    maxZoom: (cluster, value) => {
      if (value !== undefined) cluster.setMaxZoom(value);
    },
    styles: (cluster, value) => {
      if (value !== undefined) cluster.setStyles(value);
    },
  },
};

export interface LayerGroupProps {}

export const layerGroupDef: OverlayDef<LayerGroupProps, T.LayerGroup> = {
  name: "TdtLayerGroup",
  tag: "tdt-layer-group",
  props: {},
  create: () => new T.LayerGroup([]),
  detach(group) {
    group.clearLayers();
  },
};
