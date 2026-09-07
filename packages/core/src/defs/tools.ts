import { compact } from "../compact";
import { parseJson } from "./converters";
import { lineStylePropDefs, type LineStyleProps } from "./overlays";
import type { ToolDef } from "./types";

/**
 * 鼠标工具定义（Mousetool 体系）。active 受控开关不进 defs（Vue 以 prop、
 * WC 以 attribute 各自注入）；CoordinatePickup 非该体系（addEvent 开关 +
 * callback 构造），由适配层各自手写。线样式 props 与折线覆盖物共用。
 */

export interface PolylineToolProps extends LineStyleProps {
  /** 是否显示测距结果，关闭后可作画线工具使用 */
  showLabel?: boolean;
}

export const polylineToolDef: ToolDef<PolylineToolProps> = {
  name: "TdtPolylineTool",
  tag: "tdt-polyline-tool",
  props: {
    showLabel: { type: Boolean, default: undefined, attribute: "show-label" },
    ...lineStylePropDefs,
  },
  events: ["draw", "addpoint"],
  create: (props, map) =>
    new T.PolylineTool(
      map,
      compact({
        showLabel: props.showLabel,
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
};

export interface PolygonToolProps extends LineStyleProps {
  /** 是否显示测面积结果，关闭后可作画多边形工具使用 */
  showLabel?: boolean;
}

export const polygonToolDef: ToolDef<PolygonToolProps> = {
  name: "TdtPolygonTool",
  tag: "tdt-polygon-tool",
  props: {
    showLabel: { type: Boolean, default: undefined, attribute: "show-label" },
    ...lineStylePropDefs,
  },
  events: ["draw", "addpoint"],
  create: (props, map) =>
    new T.PolygonTool(
      map,
      compact({
        showLabel: props.showLabel,
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
};

export interface CircleToolProps extends LineStyleProps {
  fillColor?: string;
  fillOpacity?: number;
}

export const circleToolDef: ToolDef<CircleToolProps> = {
  name: "TdtCircleTool",
  tag: "tdt-circle-tool",
  props: {
    ...lineStylePropDefs,
    fillColor: { type: String, default: undefined, attribute: "fill-color" },
    fillOpacity: { type: Number, default: undefined, attribute: "fill-opacity" },
  },
  events: ["draw", "drawend"],
  create: (props, map) =>
    new T.CircleTool(
      map,
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
        lineStyle: props.lineStyle,
      }),
    ),
};

export interface RectangleToolProps extends LineStyleProps {
  fillColor?: string;
  fillOpacity?: number;
}

export const rectangleToolDef: ToolDef<RectangleToolProps> = {
  name: "TdtRectangleTool",
  tag: "tdt-rectangle-tool",
  props: {
    ...lineStylePropDefs,
    fillColor: { type: String, default: undefined, attribute: "fill-color" },
    fillOpacity: { type: Number, default: undefined, attribute: "fill-opacity" },
  },
  events: ["draw"],
  create: (props, map) =>
    new T.RectangleTool(
      map,
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
        lineStyle: props.lineStyle,
      }),
    ),
};

export interface MarkToolProps {
  /** 标注图标，默认为 SDK 默认图标 */
  icon?: T.Icon;
  /** 标记图标是否跟随鼠标 */
  follow?: boolean;
}

export const markToolDef: ToolDef<MarkToolProps> = {
  name: "TdtMarkTool",
  tag: "tdt-mark-tool",
  props: {
    icon: { type: Object, default: undefined, attribute: "icon", converter: parseJson },
    follow: { type: Boolean, default: undefined, attribute: "follow" },
  },
  events: ["mouseup"],
  create: (props, map) =>
    new T.MarkTool(
      map,
      compact({
        icon: props.icon,
        follow: props.follow,
      }),
    ),
};

export interface PaintBrushToolProps {
  /** 保持工具的连续可用性 */
  keepdrawing?: boolean;
  /** 画笔留下笔迹的样式（官方 PaintBrushToolOptions 的 style 字段） */
  style?: T.PaintBrushToolOptions["style"];
}

export const paintBrushToolDef: ToolDef<PaintBrushToolProps> = {
  name: "TdtPaintBrushTool",
  tag: "tdt-paint-brush-tool",
  props: {
    keepdrawing: { type: Boolean, default: undefined, attribute: "keepdrawing" },
    style: { type: Object, default: undefined, attribute: "style", converter: parseJson },
  },
  // 官方 PaintBrushTool 页未列事件表
  create: (props, map) =>
    new T.PaintBrushTool(
      map,
      compact({
        keepdrawing: props.keepdrawing,
        style: props.style,
      }),
    ),
};
