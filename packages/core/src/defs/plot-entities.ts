import { compact } from "../compact";
import type { SyncDef } from "../props-sync";
import { toLngLats } from "../session";
import { parsePath } from "./converters";
import { lineStylePropDefs, type LineStyleProps } from "./overlays";
import type { OverlayDef, PropDefs } from "./types";

/**
 * 标绘覆盖物定义。逐个从 vue 适配层迁移：props 形状与 SDK 构造是
 * vue/wc 共同的唯一来源。SDK 实体只暴露 setLngLats/getLngLats，
 * 样式 props（线样式与填充）仅构造时生效，故 sync 只含 path。
 * 官方标绘实体页未列事件表，defs 保持无 events。
 */

export interface PlotEntityProps extends LineStyleProps {
  path: Array<[number, number] | T.LngLat>;
}

export interface PlotFillEntityProps extends PlotEntityProps {
  fillColor?: string;
  fillOpacity?: number;
}

/** 标绘实体的 SDK 同构面：样式 setter 官方未提供，path 同步为唯一可变项 */
interface PlotEntityShape {
  setLngLats(lnglats: T.LngLat[]): void;
}

export const plotEntityPropDefs: PropDefs<PlotEntityProps> = {
  path: { type: Array, required: true, attribute: "path", converter: parsePath },
  ...lineStylePropDefs,
};

export const plotFillPropDefs: PropDefs<Pick<PlotFillEntityProps, "fillColor" | "fillOpacity">> = {
  fillColor: { type: String, default: undefined, attribute: "fill-color" },
  fillOpacity: { type: Number, default: undefined, attribute: "fill-opacity" },
};

export const plotEntitySync: SyncDef<PlotEntityShape, PlotEntityProps> = {
  path: (entity, value) => entity.setLngLats(toLngLats(value)),
};

/** 线型标绘实体的构造选项（官方各实体 Options 的线样式字段同构） */
interface PlotLineOptions {
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
}

/** 面型标绘实体的构造选项（在线样式基础上追加填充字段） */
interface PlotFillOptions extends PlotLineOptions {
  fillColor?: string;
  fillOpacity?: number;
}

function linePlotDef<O extends PlotEntityShape>(
  name: string,
  tag: string,
  instantiate: (points: T.LngLat[], options: PlotLineOptions) => O,
): OverlayDef<PlotEntityProps, O> {
  return {
    name,
    tag,
    props: plotEntityPropDefs,
    create: (props) =>
      instantiate(
        toLngLats(props.path),
        compact({
          color: props.color,
          weight: props.weight,
          opacity: props.opacity,
          lineStyle: props.lineStyle,
        }),
      ),
    sync: plotEntitySync,
  };
}

function fillPlotDef<O extends PlotEntityShape>(
  name: string,
  tag: string,
  instantiate: (points: T.LngLat[], options: PlotFillOptions) => O,
): OverlayDef<PlotFillEntityProps, O> {
  return {
    name,
    tag,
    props: { ...plotEntityPropDefs, ...plotFillPropDefs },
    create: (props) =>
      instantiate(
        toLngLats(props.path),
        compact({
          color: props.color,
          weight: props.weight,
          opacity: props.opacity,
          lineStyle: props.lineStyle,
          fillColor: props.fillColor,
          fillOpacity: props.fillOpacity,
        }),
      ),
    sync: plotEntitySync,
  };
}

export const arcDef = linePlotDef("TdtArc", "tdt-arc", (p, o) => new T.Arc(p, o));

export const bezierCurve2Def = linePlotDef("TdtBezierCurve2", "tdt-bezier-curve2", (p, o) => new T.BezierCurve2(p, o));

export const bezierCurve3Def = linePlotDef("TdtBezierCurve3", "tdt-bezier-curve3", (p, o) => new T.BezierCurve3(p, o));

export const bezierCurveArrowDef = linePlotDef(
  "TdtBezierCurveArrow",
  "tdt-bezier-curve-arrow",
  (p, o) => new T.BezierCurveArrow(p, o),
);

export const bezierCurveNDef = linePlotDef(
  "TdtBezierCurveN",
  "tdt-bezier-curve-n",
  (p, o) => new T.BezierCurveN(p, o),
);

export const cardinalCurveDef = linePlotDef(
  "TdtCardinalCurve",
  "tdt-cardinal-curve",
  (p, o) => new T.CardinalCurve(p, o),
);

export const cardinalCurveArrowDef = linePlotDef(
  "TdtCardinalCurveArrow",
  "tdt-cardinal-curve-arrow",
  (p, o) => new T.CardinalCurveArrow(p, o),
);

export const parallelSearchDef = linePlotDef(
  "TdtParallelSearch",
  "tdt-parallel-search",
  (p, o) => new T.ParallelSearch(p, o),
);

export const polylineArrowDef = linePlotDef(
  "TdtPolylineArrow",
  "tdt-polyline-arrow",
  (p, o) => new T.PolylineArrow(p, o),
);

export const sectorSearchDef = linePlotDef("TdtSectorSearch", "tdt-sector-search", (p, o) => new T.SectorSearch(p, o));

export const closeCurveDef = fillPlotDef("TdtCloseCurve", "tdt-close-curve", (p, o) => new T.CloseCurve(p, o));

export const curveFlagDef = fillPlotDef("TdtCurveFlag", "tdt-curve-flag", (p, o) => new T.CurveFlag(p, o));

export const diagonalArrowDef = fillPlotDef(
  "TdtDiagonalArrow",
  "tdt-diagonal-arrow",
  (p, o) => new T.DiagonalArrow(p, o),
);

export const doubleArrowDef = fillPlotDef("TdtDoubleArrow", "tdt-double-arrow", (p, o) => new T.DoubleArrow(p, o));

export const doveTailDiagonalArrowDef = fillPlotDef(
  "TdtDoveTailDiagonalArrow",
  "tdt-dove-tail-diagonal-arrow",
  (p, o) => new T.DoveTailDiagonalArrow(p, o),
);

export const doveTailStraightArrowDef = fillPlotDef(
  "TdtDoveTailStraightArrow",
  "tdt-dove-tail-straight-arrow",
  (p, o) => new T.DoveTailStraightArrow(p, o),
);

export const gatheringPlaceDef = fillPlotDef(
  "TdtGatheringPlace",
  "tdt-gathering-place",
  (p, o) => new T.GatheringPlace(p, o),
);

export const rectFlagDef = fillPlotDef("TdtRectFlag", "tdt-rect-flag", (p, o) => new T.RectFlag(p, o));

export const roundRectDef = fillPlotDef("TdtRoundRect", "tdt-round-rect", (p, o) => new T.RoundRect(p, o));

export const sectorDef = fillPlotDef("TdtSector", "tdt-sector", (p, o) => new T.Sector(p, o));

export const straightArrowDef = fillPlotDef("TdtStraightArrow", "tdt-straight-arrow", (p, o) => new T.StraightArrow(p, o));

export const triangleFlagDef = fillPlotDef("TdtTriangleFlag", "tdt-triangle-flag", (p, o) => new T.TriangleFlag(p, o));
