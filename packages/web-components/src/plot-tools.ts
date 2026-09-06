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

import { makeToolElement } from "./factory";

/**
 * 标绘工具元素族：定义见 core defs，vue/wc 共享。active attribute
 * （presence 语义）受控开关，事件以 `tdt-<官方事件名>` 转发（如 tdt-dbclick）。
 */

export const TdtArcToolElement = makeToolElement(arcToolDef);

export const TdtBezierCurve2ToolElement = makeToolElement(bezierCurve2ToolDef);

export const TdtBezierCurve3ToolElement = makeToolElement(bezierCurve3ToolDef);

export const TdtBezierCurveArrowToolElement = makeToolElement(bezierCurveArrowToolDef);

export const TdtBezierCurveNToolElement = makeToolElement(bezierCurveNToolDef);

export const TdtCardinalCurveArrowToolElement = makeToolElement(cardinalCurveArrowToolDef);

export const TdtCardinalCurveToolElement = makeToolElement(cardinalCurveToolDef);

export const TdtCloseCurveToolElement = makeToolElement(closeCurveToolDef);

export const TdtCurveFlagToolElement = makeToolElement(curveFlagToolDef);

export const TdtDiagonalArrowToolElement = makeToolElement(diagonalArrowToolDef);

export const TdtDoubleArrowToolElement = makeToolElement(doubleArrowToolDef);

export const TdtDoveTailDiagonalArrowToolElement = makeToolElement(
  doveTailDiagonalArrowToolDef,
);

export const TdtDoveTailStraightArrowToolElement = makeToolElement(
  doveTailStraightArrowToolDef,
);

export const TdtGatheringPlaceToolElement = makeToolElement(gatheringPlaceToolDef);

export const TdtHandDrawingToolElement = makeToolElement(handDrawingToolDef);

export const TdtParallelSearchToolElement = makeToolElement(parallelSearchToolDef);

export const TdtPolylineArrowToolElement = makeToolElement(polylineArrowToolDef);

export const TdtRectFlagToolElement = makeToolElement(rectFlagToolDef);

export const TdtRoundRectToolElement = makeToolElement(roundRectToolDef);

export const TdtSectorSearchToolElement = makeToolElement(sectorSearchToolDef);

export const TdtSectorToolElement = makeToolElement(sectorToolDef);

export const TdtStraightArrowToolElement = makeToolElement(straightArrowToolDef);

export const TdtTriangleFlagToolElement = makeToolElement(triangleFlagToolDef);
