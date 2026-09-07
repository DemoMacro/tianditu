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

import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 标绘覆盖物组件族：定义（props/构造/sync）见 core defs，适配层共享。
 * SDK 实体只暴露 setLngLats/getLngLats，样式 props 仅构造时生效。
 */
export type { PlotEntityProps, PlotFillEntityProps } from "@tianditu/core";

export const TdtArc = defineOverlayComponent(arcDef);

export const TdtBezierCurve2 = defineOverlayComponent(bezierCurve2Def);

export const TdtBezierCurve3 = defineOverlayComponent(bezierCurve3Def);

export const TdtBezierCurveArrow = defineOverlayComponent(bezierCurveArrowDef);

export const TdtBezierCurveN = defineOverlayComponent(bezierCurveNDef);

export const TdtCardinalCurve = defineOverlayComponent(cardinalCurveDef);

export const TdtCardinalCurveArrow = defineOverlayComponent(cardinalCurveArrowDef);

export const TdtParallelSearch = defineOverlayComponent(parallelSearchDef);

export const TdtPolylineArrow = defineOverlayComponent(polylineArrowDef);

export const TdtSectorSearch = defineOverlayComponent(sectorSearchDef);

export const TdtCloseCurve = defineOverlayComponent(closeCurveDef);

export const TdtCurveFlag = defineOverlayComponent(curveFlagDef);

export const TdtDiagonalArrow = defineOverlayComponent(diagonalArrowDef);

export const TdtDoubleArrow = defineOverlayComponent(doubleArrowDef);

export const TdtDoveTailDiagonalArrow = defineOverlayComponent(doveTailDiagonalArrowDef);

export const TdtDoveTailStraightArrow = defineOverlayComponent(doveTailStraightArrowDef);

export const TdtGatheringPlace = defineOverlayComponent(gatheringPlaceDef);

export const TdtRectFlag = defineOverlayComponent(rectFlagDef);

export const TdtRoundRect = defineOverlayComponent(roundRectDef);

export const TdtSector = defineOverlayComponent(sectorDef);

export const TdtStraightArrow = defineOverlayComponent(straightArrowDef);

export const TdtTriangleFlag = defineOverlayComponent(triangleFlagDef);
