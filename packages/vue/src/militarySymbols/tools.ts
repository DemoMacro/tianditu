import { compact } from "@tianditu/core";
import type { ComponentObjectPropsOptions } from "vue";

import { defineToolComponent } from "../tools/defineToolComponent";

/**
 * 标绘工具组件族（对照官方 militarySymbols 工具文档）。
 * 事件为官方基类成员：click / move / dbclick（官方拼写即为 dbclick）。
 * 受控 active prop 开启/关闭工具；绘制的图形经 expose 的 tool（getLayers/clear）访问。
 */

/** 官方各工具 Options 的公共字段（style / layers），组件仅透传 style */
export interface MilitaryToolProps {
  style?: T.MilitaryStyle;
}

const props: ComponentObjectPropsOptions = {
  style: { type: Object, default: undefined },
};

const TOOL_EVENTS = ["click", "move", "dbclick"] as const;

export const TdtArcTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtArcTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.ArcTool(map, compact({ style: toolProps.style })),
});

export const TdtBezierCurve2Tool = defineToolComponent<MilitaryToolProps>({
  name: "TdtBezierCurve2Tool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.BezierCurve2Tool(map, compact({ style: toolProps.style })),
});

export const TdtBezierCurve3Tool = defineToolComponent<MilitaryToolProps>({
  name: "TdtBezierCurve3Tool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.BezierCurve3Tool(map, compact({ style: toolProps.style })),
});

export const TdtBezierCurveArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtBezierCurveArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.BezierCurveArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtBezierCurveNTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtBezierCurveNTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.BezierCurveNTool(map, compact({ style: toolProps.style })),
});

export const TdtCardinalCurveArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtCardinalCurveArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) =>
    new T.CardinalCurveArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtCardinalCurveTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtCardinalCurveTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.CardinalCurveTool(map, compact({ style: toolProps.style })),
});

export const TdtCloseCurveTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtCloseCurveTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.CloseCurveTool(map, compact({ style: toolProps.style })),
});

export const TdtCurveFlagTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtCurveFlagTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.CurveFlagTool(map, compact({ style: toolProps.style })),
});

export const TdtDiagonalArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtDiagonalArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.DiagonalArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtDoubleArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtDoubleArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.DoubleArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtDoveTailDiagonalArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtDoveTailDiagonalArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) =>
    new T.DoveTailDiagonalArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtDoveTailStraightArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtDoveTailStraightArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) =>
    new T.DoveTailStraightArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtGatheringPlaceTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtGatheringPlaceTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.GatheringPlaceTool(map, compact({ style: toolProps.style })),
});

export const TdtHandDrawingTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtHandDrawingTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.HandDrawingTool(map, compact({ style: toolProps.style })),
});

export const TdtParallelSearchTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtParallelSearchTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.ParallelSearchTool(map, compact({ style: toolProps.style })),
});

export const TdtPolylineArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtPolylineArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.PolylineArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtRectFlagTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtRectFlagTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.RectFlagTool(map, compact({ style: toolProps.style })),
});

export const TdtRoundRectTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtRoundRectTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.RoundRectTool(map, compact({ style: toolProps.style })),
});

export const TdtSectorSearchTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtSectorSearchTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.SectorSearchTool(map, compact({ style: toolProps.style })),
});

export const TdtSectorTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtSectorTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.SectorTool(map, compact({ style: toolProps.style })),
});

export const TdtStraightArrowTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtStraightArrowTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.StraightArrowTool(map, compact({ style: toolProps.style })),
});

export const TdtTriangleFlagTool = defineToolComponent<MilitaryToolProps>({
  name: "TdtTriangleFlagTool",
  props,
  events: TOOL_EVENTS,
  create: (toolProps, map) => new T.TriangleFlagTool(map, compact({ style: toolProps.style })),
});
