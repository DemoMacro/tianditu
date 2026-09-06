import { compact } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { lineStyleProps, type LineStyleProps } from "./polyline";
import { toLngLatsProp } from "./utils";

export interface PolygonProps extends LineStyleProps {
  path: Array<[number, number] | T.LngLat>;
  fillColor?: string;
  fillOpacity?: number;
}

export const TdtPolygon = defineOverlayComponent<PolygonProps, T.Polygon>({
  name: "TdtPolygon",
  props: {
    path: { type: Array, required: true },
    ...lineStyleProps,
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"] as const,
  create(props) {
    const polygon = new T.Polygon(
      toLngLatsProp(props.path),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    );
    return polygon;
  },
  sync: {
    path: (polygon, value) => polygon.setLngLats(toLngLatsProp(value)),
    color: (polygon, value) => {
      if (value !== undefined) polygon.setColor(value);
    },
    weight: (polygon, value) => {
      if (value !== undefined) polygon.setWeight(value);
    },
    opacity: (polygon, value) => {
      if (value !== undefined) polygon.setOpacity(value);
    },
    lineStyle: (polygon, value) => {
      if (value !== undefined) polygon.setLineStyle(value);
    },
    fillColor: (polygon, value) => {
      if (value !== undefined) polygon.setFillColor(value);
    },
    fillOpacity: (polygon, value) => {
      if (value !== undefined) polygon.setFillOpacity(value);
    },
  },
});
