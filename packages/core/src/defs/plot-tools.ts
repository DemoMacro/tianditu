import { compact } from "../compact";
import type { ToolLike } from "../tools";
import { parseJson } from "./converters";
import type { PropDefs, ToolDef } from "./types";

/**
 * 标绘鼠标工具定义族（军事标绘体系，SDK 基类 MilitaryTool）。23 个工具
 * 完全同构：公共 Options 仅 style 与 layers（存储绘制图形的容器），事件表
 * 为官方基类成员 click/move/dbclick（官方拼写即为 dbclick），故用一个
 * helper 从 SDK 类名批量生成，逐个搬运 vue 实现的构造参数。
 */

export interface PlotToolProps {
  /** 绘制图形的样式（官方 MilitaryToolOptions 的 style 字段） */
  style?: T.MilitaryStyle;
  /** 存储绘制图形的容器；不传时工具自行创建空图层容器 */
  layers?: T.LayerGroup;
}

export const plotToolPropDefs: PropDefs<PlotToolProps> = {
  // MilitaryStyle 为纯数据接口，可用 JSON attribute；
  // layers 是 SDK 实例，不可序列化，仅 JS-only property
  style: { type: Object, default: undefined, attribute: "style", converter: parseJson },
  layers: { type: Object, default: undefined },
};

const PLOT_TOOL_EVENTS = ["click", "move", "dbclick"] as const;

/**
 * 惰性构造回调：SDK 类经全局 T 异步加载，模块顶层引用类值会
 * ReferenceError，统一在回调体内 new。
 */
type PlotToolInstantiate = (map: T.Map, options: T.MilitaryToolOptions) => ToolLike;

/** TdtArcTool → tdt-arc-tool：tag 由 SDK 类名展开 */
function tagOf(name: string): string {
  return (
    "tdt-" +
    name
      .slice(3)
      .replace(/[A-Z]/g, (char) => "-" + char.toLowerCase())
      .slice(1)
  );
}

function plotToolDef(name: string, instantiate: PlotToolInstantiate): ToolDef<PlotToolProps> {
  return {
    name,
    tag: tagOf(name),
    props: plotToolPropDefs,
    events: PLOT_TOOL_EVENTS,
    create: (props, map) => instantiate(map, compact({ style: props.style, layers: props.layers })),
  };
}

export const arcToolDef = plotToolDef("TdtArcTool", (map, o) => new T.ArcTool(map, o));
export const bezierCurve2ToolDef = plotToolDef(
  "TdtBezierCurve2Tool",
  (map, o) => new T.BezierCurve2Tool(map, o),
);
export const bezierCurve3ToolDef = plotToolDef(
  "TdtBezierCurve3Tool",
  (map, o) => new T.BezierCurve3Tool(map, o),
);
export const bezierCurveArrowToolDef = plotToolDef(
  "TdtBezierCurveArrowTool",
  (map, o) => new T.BezierCurveArrowTool(map, o),
);
export const bezierCurveNToolDef = plotToolDef(
  "TdtBezierCurveNTool",
  (map, o) => new T.BezierCurveNTool(map, o),
);
export const cardinalCurveArrowToolDef = plotToolDef(
  "TdtCardinalCurveArrowTool",
  (map, o) => new T.CardinalCurveArrowTool(map, o),
);
export const cardinalCurveToolDef = plotToolDef(
  "TdtCardinalCurveTool",
  (map, o) => new T.CardinalCurveTool(map, o),
);
export const closeCurveToolDef = plotToolDef(
  "TdtCloseCurveTool",
  (map, o) => new T.CloseCurveTool(map, o),
);
export const curveFlagToolDef = plotToolDef(
  "TdtCurveFlagTool",
  (map, o) => new T.CurveFlagTool(map, o),
);
export const diagonalArrowToolDef = plotToolDef(
  "TdtDiagonalArrowTool",
  (map, o) => new T.DiagonalArrowTool(map, o),
);
export const doubleArrowToolDef = plotToolDef(
  "TdtDoubleArrowTool",
  (map, o) => new T.DoubleArrowTool(map, o),
);
export const doveTailDiagonalArrowToolDef = plotToolDef(
  "TdtDoveTailDiagonalArrowTool",
  (map, o) => new T.DoveTailDiagonalArrowTool(map, o),
);
export const doveTailStraightArrowToolDef = plotToolDef(
  "TdtDoveTailStraightArrowTool",
  (map, o) => new T.DoveTailStraightArrowTool(map, o),
);
export const gatheringPlaceToolDef = plotToolDef(
  "TdtGatheringPlaceTool",
  (map, o) => new T.GatheringPlaceTool(map, o),
);
export const handDrawingToolDef = plotToolDef(
  "TdtHandDrawingTool",
  (map, o) => new T.HandDrawingTool(map, o),
);
export const parallelSearchToolDef = plotToolDef(
  "TdtParallelSearchTool",
  (map, o) => new T.ParallelSearchTool(map, o),
);
export const polylineArrowToolDef = plotToolDef(
  "TdtPolylineArrowTool",
  (map, o) => new T.PolylineArrowTool(map, o),
);
export const rectFlagToolDef = plotToolDef(
  "TdtRectFlagTool",
  (map, o) => new T.RectFlagTool(map, o),
);
export const roundRectToolDef = plotToolDef(
  "TdtRoundRectTool",
  (map, o) => new T.RoundRectTool(map, o),
);
export const sectorSearchToolDef = plotToolDef(
  "TdtSectorSearchTool",
  (map, o) => new T.SectorSearchTool(map, o),
);
export const sectorToolDef = plotToolDef("TdtSectorTool", (map, o) => new T.SectorTool(map, o));
export const straightArrowToolDef = plotToolDef(
  "TdtStraightArrowTool",
  (map, o) => new T.StraightArrowTool(map, o),
);
export const triangleFlagToolDef = plotToolDef(
  "TdtTriangleFlagTool",
  (map, o) => new T.TriangleFlagTool(map, o),
);
