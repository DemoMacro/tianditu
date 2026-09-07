import {
  arcToolDef,
  bezierCurve2ToolDef,
  bezierCurve3ToolDef,
  bezierCurveArrowToolDef,
  bezierCurveNToolDef,
  cardinalCurveArrowToolDef,
  cardinalCurveToolDef,
  closeCurveToolDef,
  curveFlagToolDef,
  diagonalArrowToolDef,
  doubleArrowToolDef,
  doveTailDiagonalArrowToolDef,
  doveTailStraightArrowToolDef,
  gatheringPlaceToolDef,
  handDrawingToolDef,
  parallelSearchToolDef,
  polylineArrowToolDef,
  rectFlagToolDef,
  roundRectToolDef,
  sectorSearchToolDef,
  sectorToolDef,
  straightArrowToolDef,
  triangleFlagToolDef,
} from "@tianditu/core";

import { defineToolComponent } from "../tools/defineToolComponent";

/**
 * 标绘工具组件族：定义见 core defs，vue/wc 共享。受控 active prop 开启/
 * 关闭工具；绘制的图形经 expose 的 tool（getLayers/clear）访问。
 */

export type { PlotToolProps } from "@tianditu/core";

export const TdtArcTool = defineToolComponent(arcToolDef);

export const TdtBezierCurve2Tool = defineToolComponent(bezierCurve2ToolDef);

export const TdtBezierCurve3Tool = defineToolComponent(bezierCurve3ToolDef);

export const TdtBezierCurveArrowTool = defineToolComponent(bezierCurveArrowToolDef);

export const TdtBezierCurveNTool = defineToolComponent(bezierCurveNToolDef);

export const TdtCardinalCurveArrowTool = defineToolComponent(cardinalCurveArrowToolDef);

export const TdtCardinalCurveTool = defineToolComponent(cardinalCurveToolDef);

export const TdtCloseCurveTool = defineToolComponent(closeCurveToolDef);

export const TdtCurveFlagTool = defineToolComponent(curveFlagToolDef);

export const TdtDiagonalArrowTool = defineToolComponent(diagonalArrowToolDef);

export const TdtDoubleArrowTool = defineToolComponent(doubleArrowToolDef);

export const TdtDoveTailDiagonalArrowTool = defineToolComponent(doveTailDiagonalArrowToolDef);

export const TdtDoveTailStraightArrowTool = defineToolComponent(doveTailStraightArrowToolDef);

export const TdtGatheringPlaceTool = defineToolComponent(gatheringPlaceToolDef);

export const TdtHandDrawingTool = defineToolComponent(handDrawingToolDef);

export const TdtParallelSearchTool = defineToolComponent(parallelSearchToolDef);

export const TdtPolylineArrowTool = defineToolComponent(polylineArrowToolDef);

export const TdtRectFlagTool = defineToolComponent(rectFlagToolDef);

export const TdtRoundRectTool = defineToolComponent(roundRectToolDef);

export const TdtSectorSearchTool = defineToolComponent(sectorSearchToolDef);

export const TdtSectorTool = defineToolComponent(sectorToolDef);

export const TdtStraightArrowTool = defineToolComponent(straightArrowToolDef);

export const TdtTriangleFlagTool = defineToolComponent(triangleFlagToolDef);
