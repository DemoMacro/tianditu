import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatsProp } from "./utils";

export interface LineStyleProps {
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
}

/** 折线/多边形共用的线样式运行时 props */
export const lineStyleProps = {
  color: { type: String, default: undefined },
  weight: { type: Number, default: undefined },
  opacity: { type: Number, default: undefined },
  lineStyle: { type: String, default: undefined },
};

export interface PolylineProps extends LineStyleProps {
  path: Array<[number, number] | T.LngLat>;
}

export const TdtPolyline = defineOverlayComponent<PolylineProps, T.Polyline>({
  name: "TdtPolyline",
  props: {
    path: { type: Array, required: true },
    ...lineStyleProps,
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout"] as const,
  create(props, { map }) {
    const polyline = new T.Polyline(toLngLatsProp(props.path), {
      color: props.color,
      weight: props.weight,
      opacity: props.opacity,
      lineStyle: props.lineStyle,
    });
    map.addOverLay(polyline);
    return polyline;
  },
  sync: {
    path: (polyline, value) => polyline.setLngLats(toLngLatsProp(value)),
    color: (polyline, value) => {
      if (value !== undefined) polyline.setColor(value);
    },
    weight: (polyline, value) => {
      if (value !== undefined) polyline.setWeight(value);
    },
    lineStyle: (polyline, value) => {
      if (value !== undefined) polyline.setLineStyle(value);
    },
  },
});
