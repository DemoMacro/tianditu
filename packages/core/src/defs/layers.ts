import { compact } from "../compact";
import { TILE_LAYER_EVENT_NAMES } from "../layer";
import type { SyncDef } from "../props-sync";
import { parseBounds, parseJson } from "./converters";
import type { LayerDef, PropDefs } from "./types";

/**
 * 瓦片图层定义。逐个从 vue 适配层迁移：props 形状、SDK 构造、sync 与
 * 事件表是 vue/wc 共同的唯一来源。minZoom/maxZoom 仅构造生效（SDK 无
 * setter），不进 sync；格网图层官方仅列 loading/load 两个事件，sync
 * 收窄为仅 opacity（官方选项无 url/zIndex）。
 */

export interface TileLayerProps {
  /** 瓦片服务 URL 模板 */
  url: string;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
  zIndex?: number;
  /** 瓦片加载失败时显示的图片 URL */
  errorTileUrl?: string;
  /** 图层显示范围（官方 TileLayerOptions.bounds） */
  bounds?: [[number, number], [number, number]] | T.LngLatBounds;
}

function toBoundsProp(value: TileLayerProps["bounds"]): T.LngLatBounds | undefined {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}

/** 三个瓦片图层共用的基础 props（minZoom/maxZoom 仅构造生效） */
const tileLayerBasePropDefs: PropDefs<TileLayerProps> = {
  url: { type: String, required: true, attribute: "url" },
  minZoom: { type: Number, default: undefined, attribute: "min-zoom" },
  maxZoom: { type: Number, default: undefined, attribute: "max-zoom" },
  opacity: { type: Number, default: undefined, attribute: "opacity" },
  zIndex: { type: Number, default: undefined, attribute: "z-index" },
  errorTileUrl: { type: String, default: undefined, attribute: "error-tile-url" },
  bounds: { type: Array, default: undefined, attribute: "bounds", converter: parseBounds },
};

/** url/opacity/zIndex 的 setter 同步（SDK 无 minZoom/maxZoom setter） */
const tileLayerSync: SyncDef<T.TileLayer, TileLayerProps> = {
  opacity: (layer, value) => layer.setOpacity(value ?? 1),
  zIndex: (layer, value) => layer.setZIndex(value ?? 0),
  url: (layer, value) => layer.setUrl(value),
};

export const tileLayerDef: LayerDef<TileLayerProps> = {
  name: "TdtTileLayer",
  tag: "tdt-tile-layer",
  props: tileLayerBasePropDefs,
  events: TILE_LAYER_EVENT_NAMES,
  create: (props) =>
    new T.TileLayer(
      props.url,
      compact({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        zIndex: props.zIndex,
        errorTileUrl: props.errorTileUrl,
        bounds: toBoundsProp(props.bounds),
      }),
    ),
  sync: tileLayerSync,
};

export interface TileLayerWMSProps extends TileLayerProps {
  /** 用","分隔的多个图层列表 */
  layers?: string;
  styles?: string;
  /** 输出图像类型，default: image/jpeg */
  format?: string;
  transparent?: boolean;
  /** 请求服务的版本，default: 1.1.1 */
  version?: string;
  /** 地图投影类型，default: EPSG:900913 */
  srs?: string;
}

export const tileLayerWmsDef: LayerDef<TileLayerWMSProps> = {
  name: "TdtTileLayerWMS",
  tag: "tdt-tile-layer-wms",
  props: {
    ...tileLayerBasePropDefs,
    layers: { type: String, default: undefined, attribute: "layers" },
    styles: { type: String, default: undefined, attribute: "styles" },
    format: { type: String, default: undefined, attribute: "format" },
    transparent: { type: Boolean, default: undefined, attribute: "transparent" },
    version: { type: String, default: undefined, attribute: "version" },
    srs: { type: String, default: undefined, attribute: "srs" },
  },
  events: TILE_LAYER_EVENT_NAMES,
  create: (props) =>
    new T.TileLayerWMS(
      props.url,
      compact({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        zIndex: props.zIndex,
        layers: props.layers,
        styles: props.styles,
        format: props.format,
        transparent: props.transparent,
        version: props.version,
        srs: props.srs,
      }),
    ),
  sync: tileLayerSync,
};

export interface TileLayerTDTProps extends TileLayerProps {
  /** 用来描述图层信息 */
  attribution?: string;
}

export const tileLayerTdtDef: LayerDef<TileLayerTDTProps> = {
  name: "TdtTileLayerTDT",
  tag: "tdt-tile-layer-tdt",
  props: {
    ...tileLayerBasePropDefs,
    attribution: { type: String, default: undefined, attribute: "attribution" },
  },
  events: TILE_LAYER_EVENT_NAMES,
  create: (props) =>
    new T.TileLayerTDT(
      props.url,
      compact({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        zIndex: props.zIndex,
        errorTileUrl: props.errorTileUrl,
        bounds: toBoundsProp(props.bounds),
        attribution: props.attribution,
      }),
    ),
  sync: tileLayerSync,
};

export interface GridlineLayerProps {
  /** 格网图层的网格大小，单位是像素，default: 256 */
  tileSize?: number;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
  /** 边线的颜色、宽度、线样式，default: {width:1, style:'solid', color:'#999'} */
  outlineSize?: T.GridlineLayerOptions["outlineSize"];
  /** 文字样式，图层文字表现网格的行号、列号、层级，default: {display:false, fontSize:'14', fontWeight:true, color:'black'} */
  textSize?: T.GridlineLayerOptions["textSize"];
}

export const gridlineLayerDef: LayerDef<GridlineLayerProps> = {
  name: "TdtGridlineLayer",
  tag: "tdt-gridline-layer",
  props: {
    tileSize: { type: Number, default: undefined, attribute: "tile-size" },
    minZoom: { type: Number, default: undefined, attribute: "min-zoom" },
    maxZoom: { type: Number, default: undefined, attribute: "max-zoom" },
    opacity: { type: Number, default: undefined, attribute: "opacity" },
    outlineSize: {
      type: Object,
      default: undefined,
      attribute: "outline-size",
      converter: parseJson,
    },
    textSize: { type: Object, default: undefined, attribute: "text-size", converter: parseJson },
  },
  // 官方仅列 loading/load 两个事件
  events: ["loading", "load"],
  create: (props) =>
    new T.GridlineLayer(
      compact({
        tileSize: props.tileSize,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        outlineSize: props.outlineSize,
        textSize: props.textSize,
      }),
    ),
  // 官方选项无 url/zIndex，仅 opacity 有 setter（setOpacity）
  sync: {
    opacity: (layer, value) => layer.setOpacity(value ?? 1),
  },
};
