import type { OverlayCollector, OverlayMountContext } from "../overlay";
import type { SyncDef } from "../props-sync";
import type { ToolLike } from "../tools";

/**
 * 框架无关的组件定义层类型。每个组件一份纯数据定义（props 形状、SDK 构造、
 * sync、事件表），Vue 适配层与 Web Components 适配层各自消费同一份定义，
 * 保证两个适配层一对一对应且共享逻辑只写一份。
 *
 * props 形状 P 为「已解析的 JS 值」形态（如 [number, number]、T.IconOptions）；
 * attribute 字符串的解析由 PropDef.converter 声明，响应式追踪由各适配层实现。
 */

/** vue 运行时支持的构造器类型子集 */
export type PropTypeConstructor =
  | BooleanConstructor
  | StringConstructor
  | NumberConstructor
  | ArrayConstructor
  | ObjectConstructor;

export interface PropDef<P = unknown> {
  /** vue 运行时类型 */
  type?: PropTypeConstructor;
  required?: boolean;
  default?: P | (() => P);
  /**
   * WC attribute 名（kebab-case）。省略 = JS-only property，用于 T.LayerGroup
   * 等不可序列化的 SDK 实例。converter 未声明时按 type 走内建转换
   * （Boolean 为 presence 语义：attribute 存在即 true）。
   */
  attribute?: string;
  /** attribute 字符串 → 属性值；坐标、JSON 等复杂形态在此声明 */
  converter?: (value: string) => P;
  /** 变更是否反射回 attribute（仅 open/active 等布尔状态需要） */
  reflect?: boolean;
}

export type PropDefs<P extends object> = { [K in keyof P]: PropDef<P[K]> };

/** create 收到的挂载上下文（构造 SDK 实例可能需要 map，如 MarkerClusterer） */
export interface DefCreateContext {
  map: T.Map;
}

/** 覆盖物定义（Marker/Polyline/MarkerClusterer/LayerGroup 等） */
export interface OverlayDef<P extends object, O> {
  /** vue 组件名（TdtXxx）与 wc 元素类名（TdtXxxElement）共用 */
  name: string;
  /** WC 元素 tag（tdt-xxx） */
  tag: string;
  props: PropDefs<P>;
  /** SDK 原生事件名；适配层转发为组件事件 / tdt- 前缀 DOM 事件 */
  events?: readonly string[];
  create(props: P, ctx: DefCreateContext): O;
  sync?: SyncDef<O, P>;
  /** 覆盖默认挂载（有 collector 走 addMarker，否则 addOverLay）；不依赖 this，适配层直接传递引用 */
  attach?: (this: void, instance: O, ctx: OverlayMountContext) => void;
  /** 覆盖默认卸载（如 MarkerClusterer.clearMarkers） */
  detach?: (this: void, instance: O, ctx: OverlayMountContext) => void;
}

/** 鼠标工具定义（active 受控开关由适配层注入，不进 defs） */
export interface ToolDef<P extends object> {
  name: string;
  tag: string;
  props: PropDefs<P>;
  events?: readonly string[];
  create(props: P, map: T.Map): ToolLike;
  /** 默认调用 tool.open()（Mousetool 语义）；不依赖 this，适配层直接传递引用 */
  activate?: (this: void, tool: ToolLike) => void;
  deactivate?: (this: void, tool: ToolLike) => void;
}

/** 控件定义（Zoom/Scale/Copyright/OverviewMap/MapType/标绘控件） */
export interface ControlDef<P extends object> {
  name: string;
  tag: string;
  props: PropDefs<P>;
  create(props: P): T.Control;
}

/** 瓦片图层定义（TileLayer/WMS/TDT/GridlineLayer） */
export interface LayerDef<P extends object> {
  name: string;
  tag: string;
  props: PropDefs<P>;
  /** 默认为全部瓦片图层事件（GridlineLayer 收窄为 loading/load） */
  events?: readonly string[];
  create(props: P): T.TileLayer;
  /** 默认为 opacity/zIndex/url 同步（GridlineLayer 整表替换为仅 opacity） */
  sync?: SyncDef<T.TileLayer, P>;
}

/** OverlayCollector 从 overlay.ts 重导出，适配层无需感知来源 */
export type { OverlayCollector, OverlayMountContext };
