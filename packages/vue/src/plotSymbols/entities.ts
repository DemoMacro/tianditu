import { compact } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatsProp } from "../overlays/utils";

/**
 * 标绘覆盖物组件族。
 * 各实体仅暴露 setLngLats/getLngLats，样式 props 仅构造时生效。
 */

const pathProp = { path: { type: Array, required: true } };

const colorProp = { color: { type: String, default: undefined } };
const weightProp = { weight: { type: Number, default: undefined } };
const opacityProp = { opacity: { type: Number, default: undefined } };
const lineStyleProp = { lineStyle: { type: String, default: undefined } };
const fillColorProp = { fillColor: { type: String, default: undefined } };
const fillOpacityProp = { fillOpacity: { type: Number, default: undefined } };

interface PlotEntityProps {
  path: Array<[number, number] | T.LngLat>;
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
  fillColor?: string;
  fillOpacity?: number;
}

const lineSync = {
  path: (
    entity: { setLngLats(v: ReturnType<typeof toLngLatsProp>): void },
    value: PlotEntityProps["path"],
  ) => entity.setLngLats(toLngLatsProp(value)),
};

export const TdtArc = defineOverlayComponent<PlotEntityProps, T.Arc>({
  name: "TdtArc",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.Arc(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtBezierCurve2 = defineOverlayComponent<PlotEntityProps, T.BezierCurve2>({
  name: "TdtBezierCurve2",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.BezierCurve2(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtBezierCurve3 = defineOverlayComponent<PlotEntityProps, T.BezierCurve3>({
  name: "TdtBezierCurve3",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.BezierCurve3(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtBezierCurveArrow = defineOverlayComponent<PlotEntityProps, T.BezierCurveArrow>({
  name: "TdtBezierCurveArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.BezierCurveArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtBezierCurveN = defineOverlayComponent<PlotEntityProps, T.BezierCurveN>({
  name: "TdtBezierCurveN",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.BezierCurveN(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtCardinalCurve = defineOverlayComponent<PlotEntityProps, T.CardinalCurve>({
  name: "TdtCardinalCurve",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.CardinalCurve(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtCardinalCurveArrow = defineOverlayComponent<PlotEntityProps, T.CardinalCurveArrow>({
  name: "TdtCardinalCurveArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.CardinalCurveArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtCloseCurve = defineOverlayComponent<PlotEntityProps, T.CloseCurve>({
  name: "TdtCloseCurve",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.CloseCurve(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtCurveFlag = defineOverlayComponent<PlotEntityProps, T.CurveFlag>({
  name: "TdtCurveFlag",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.CurveFlag(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtDiagonalArrow = defineOverlayComponent<PlotEntityProps, T.DiagonalArrow>({
  name: "TdtDiagonalArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.DiagonalArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtDoubleArrow = defineOverlayComponent<PlotEntityProps, T.DoubleArrow>({
  name: "TdtDoubleArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.DoubleArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtDoveTailDiagonalArrow = defineOverlayComponent<
  PlotEntityProps,
  T.DoveTailDiagonalArrow
>({
  name: "TdtDoveTailDiagonalArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.DoveTailDiagonalArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtDoveTailStraightArrow = defineOverlayComponent<
  PlotEntityProps,
  T.DoveTailStraightArrow
>({
  name: "TdtDoveTailStraightArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.DoveTailStraightArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtGatheringPlace = defineOverlayComponent<PlotEntityProps, T.GatheringPlace>({
  name: "TdtGatheringPlace",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.GatheringPlace(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtParallelSearch = defineOverlayComponent<PlotEntityProps, T.ParallelSearch>({
  name: "TdtParallelSearch",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.ParallelSearch(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtPolylineArrow = defineOverlayComponent<PlotEntityProps, T.PolylineArrow>({
  name: "TdtPolylineArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.PolylineArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtRectFlag = defineOverlayComponent<PlotEntityProps, T.RectFlag>({
  name: "TdtRectFlag",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.RectFlag(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtRoundRect = defineOverlayComponent<PlotEntityProps, T.RoundRect>({
  name: "TdtRoundRect",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.RoundRect(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtSector = defineOverlayComponent<PlotEntityProps, T.Sector>({
  name: "TdtSector",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.Sector(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtSectorSearch = defineOverlayComponent<PlotEntityProps, T.SectorSearch>({
  name: "TdtSectorSearch",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
  },
  create: (props) =>
    new T.SectorSearch(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
  sync: lineSync,
});

export const TdtStraightArrow = defineOverlayComponent<PlotEntityProps, T.StraightArrow>({
  name: "TdtStraightArrow",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.StraightArrow(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});

export const TdtTriangleFlag = defineOverlayComponent<PlotEntityProps, T.TriangleFlag>({
  name: "TdtTriangleFlag",
  props: {
    ...pathProp,
    ...colorProp,
    ...weightProp,
    ...opacityProp,
    ...lineStyleProp,
    ...fillColorProp,
    ...fillOpacityProp,
  },
  create: (props) =>
    new T.TriangleFlag(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    ),
  sync: lineSync,
});
