import { compact } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatProp } from "./utils";

export interface CircleProps {
  center: [number, number] | T.LngLat;
  /** 半径，单位米 */
  radius: number;
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
  fillColor?: string;
  fillOpacity?: number;
}

export const TdtCircle = defineOverlayComponent<CircleProps, T.Circle>({
  name: "TdtCircle",
  props: {
    center: { type: Array, required: true },
    radius: { type: Number, required: true },
    color: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    lineStyle: { type: String, default: undefined },
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "remove"] as const,
  create(props) {
    const circle = new T.Circle(
      toLngLatProp(props.center),
      props.radius,
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
      }),
    );
    return circle;
  },
  sync: {
    center: (circle, value) => circle.setCenter(toLngLatProp(value)),
    radius: (circle, value) => circle.setRadius(value),
    color: (circle, value) => {
      if (value !== undefined) circle.setColor(value);
    },
    weight: (circle, value) => {
      if (value !== undefined) circle.setWeight(value);
    },
    opacity: (circle, value) => {
      if (value !== undefined) circle.setOpacity(value);
    },
    lineStyle: (circle, value) => {
      if (value !== undefined) circle.setLineStyle(value);
    },
    fillColor: (circle, value) => {
      if (value !== undefined) circle.setFillColor(value);
    },
    fillOpacity: (circle, value) => {
      if (value !== undefined) circle.setFillOpacity(value);
    },
  },
});
