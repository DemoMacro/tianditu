import { compact } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatsProp } from "../overlays/utils";

/**
 * 标绘覆盖物组件族（对照官方 militarySymbols 文档）。
 * 各实体仅暴露 setLngLats/getLngLats，样式 props 仅构造时生效。
 */

const pathProp = { path: { type: Array, required: true } };

const colorProp = { color: { type: String, default: undefined } };
const weightProp = { weight: { type: Number, default: undefined } };
const opacityProp = { opacity: { type: Number, default: undefined } };
const lineStyleProp = { lineStyle: { type: String, default: undefined } };
const fillColorProp = { fillColor: { type: String, default: undefined } };
const fillOpacityProp = { fillOpacity: { type: Number, default: undefined } };

interface MilitaryEntityProps {
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
    value: MilitaryEntityProps["path"],
  ) => entity.setLngLats(toLngLatsProp(value)),
};

export const TdtArc = defineOverlayComponent<MilitaryEntityProps, T.Arc>({
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

export const TdtBezierCurve2 = defineOverlayComponent<MilitaryEntityProps, T.BezierCurve2>({
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

export const TdtBezierCurve3 = defineOverlayComponent<MilitaryEntityProps, T.BezierCurve3>({
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

export const TdtBezierCurveArrow = defineOverlayComponent<MilitaryEntityProps, T.BezierCurveArrow>({
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

export const TdtBezierCurveN = defineOverlayComponent<MilitaryEntityProps, T.BezierCurveN>({
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

export const TdtCardinalCurve = defineOverlayComponent<MilitaryEntityProps, T.CardinalCurve>({
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

export const TdtCardinalCurveArrow = defineOverlayComponent<
  MilitaryEntityProps,
  T.CardinalCurveArrow
>({
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

export const TdtCloseCurve = defineOverlayComponent<MilitaryEntityProps, T.CloseCurve>({
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

export const TdtCurveFlag = defineOverlayComponent<MilitaryEntityProps, T.CurveFlag>({
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

export const TdtDiagonalArrow = defineOverlayComponent<MilitaryEntityProps, T.DiagonalArrow>({
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

export const TdtDoubleArrow = defineOverlayComponent<MilitaryEntityProps, T.DoubleArrow>({
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
  MilitaryEntityProps,
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
  MilitaryEntityProps,
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

export const TdtGatheringPlace = defineOverlayComponent<MilitaryEntityProps, T.GatheringPlace>({
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

export const TdtParallelSearch = defineOverlayComponent<MilitaryEntityProps, T.ParallelSearch>({
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

export const TdtPolylineArrow = defineOverlayComponent<MilitaryEntityProps, T.PolylineArrow>({
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

export const TdtRectFlag = defineOverlayComponent<MilitaryEntityProps, T.RectFlag>({
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

export const TdtRoundRect = defineOverlayComponent<MilitaryEntityProps, T.RoundRect>({
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

export const TdtSector = defineOverlayComponent<MilitaryEntityProps, T.Sector>({
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

export const TdtSectorSearch = defineOverlayComponent<MilitaryEntityProps, T.SectorSearch>({
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

export const TdtStraightArrow = defineOverlayComponent<MilitaryEntityProps, T.StraightArrow>({
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

export const TdtTriangleFlag = defineOverlayComponent<MilitaryEntityProps, T.TriangleFlag>({
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
