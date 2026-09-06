import {
  arcDef,
  bezierCurve2Def,
  bezierCurve3Def,
  bezierCurveArrowDef,
  bezierCurveNDef,
  cardinalCurveArrowDef,
  cardinalCurveDef,
  closeCurveDef,
  curveFlagDef,
  diagonalArrowDef,
  doubleArrowDef,
  doveTailDiagonalArrowDef,
  doveTailStraightArrowDef,
  gatheringPlaceDef,
  parallelSearchDef,
  polylineArrowDef,
  rectFlagDef,
  roundRectDef,
  sectorDef,
  sectorSearchDef,
  straightArrowDef,
  triangleFlagDef,
} from "@tianditu/core";

import { makeOverlayElement } from "./factory";

/**
 * 标绘覆盖物元素：定义（props/构造/sync）见 core defs，vue/wc 共享。
 * attribute path 形如 "lng,lat;lng,lat"；样式 props 仅构造时生效。
 */

export const TdtArcElement = makeOverlayElement(arcDef);

export const TdtBezierCurve2Element = makeOverlayElement(bezierCurve2Def);

export const TdtBezierCurve3Element = makeOverlayElement(bezierCurve3Def);

export const TdtBezierCurveArrowElement = makeOverlayElement(bezierCurveArrowDef);

export const TdtBezierCurveNElement = makeOverlayElement(bezierCurveNDef);

export const TdtCardinalCurveElement = makeOverlayElement(cardinalCurveDef);

export const TdtCardinalCurveArrowElement = makeOverlayElement(cardinalCurveArrowDef);

export const TdtParallelSearchElement = makeOverlayElement(parallelSearchDef);

export const TdtPolylineArrowElement = makeOverlayElement(polylineArrowDef);

export const TdtSectorSearchElement = makeOverlayElement(sectorSearchDef);

export const TdtCloseCurveElement = makeOverlayElement(closeCurveDef);

export const TdtCurveFlagElement = makeOverlayElement(curveFlagDef);

export const TdtDiagonalArrowElement = makeOverlayElement(diagonalArrowDef);

export const TdtDoubleArrowElement = makeOverlayElement(doubleArrowDef);

export const TdtDoveTailDiagonalArrowElement = makeOverlayElement(doveTailDiagonalArrowDef);

export const TdtDoveTailStraightArrowElement = makeOverlayElement(doveTailStraightArrowDef);

export const TdtGatheringPlaceElement = makeOverlayElement(gatheringPlaceDef);

export const TdtRectFlagElement = makeOverlayElement(rectFlagDef);

export const TdtRoundRectElement = makeOverlayElement(roundRectDef);

export const TdtSectorElement = makeOverlayElement(sectorDef);

export const TdtStraightArrowElement = makeOverlayElement(straightArrowDef);

export const TdtTriangleFlagElement = makeOverlayElement(triangleFlagDef);
