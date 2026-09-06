import { compact } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";
import type { LineStyleProps } from "./polyline";

export interface RectangleProps extends LineStyleProps {
  /** 西南角与东北角坐标 [[swLng, swLat], [neLng, neLat]] */
  bounds: [[number, number], [number, number]] | T.LngLatBounds;
  fillColor?: string;
  fillOpacity?: number;
}

export const TdtRectangle = defineOverlayComponent<RectangleProps, T.Rectangle>({
  name: "TdtRectangle",
  props: {
    bounds: { type: Array, required: true },
    color: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    lineStyle: { type: String, default: undefined },
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"] as const,
  create(props) {
    const rectangle = new T.Rectangle(
      toBoundsProp(props.bounds),
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    );
    return rectangle;
  },
  sync: {
    bounds: (rectangle, value) => rectangle.setBounds(toBoundsProp(value)),
    color: (rectangle, value) => {
      if (value !== undefined) rectangle.setColor(value);
    },
    weight: (rectangle, value) => {
      if (value !== undefined) rectangle.setWeight(value);
    },
    opacity: (rectangle, value) => {
      if (value !== undefined) rectangle.setOpacity(value);
    },
    lineStyle: (rectangle, value) => {
      if (value !== undefined) rectangle.setLineStyle(value);
    },
    fillColor: (rectangle, value) => {
      if (value !== undefined) rectangle.setFillColor(value);
    },
    fillOpacity: (rectangle, value) => {
      if (value !== undefined) rectangle.setFillOpacity(value);
    },
  },
});

function toBoundsProp(
  value: [[number, number], [number, number]] | T.LngLatBounds,
): T.LngLatBounds {
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}
