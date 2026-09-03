import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatProp } from "./utils";

export interface CircleProps {
  center: [number, number] | T.LngLat;
  /** 半径，单位米 */
  radius: number;
  color?: string;
  weight?: number;
  opacity?: number;
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
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout"] as const,
  create(props, { map }) {
    const circle = new T.Circle(toLngLatProp(props.center), props.radius, {
      color: props.color,
      weight: props.weight,
      opacity: props.opacity,
      fillColor: props.fillColor,
      fillOpacity: props.fillOpacity,
    });
    map.addOverLay(circle);
    return circle;
  },
  sync: {
    center: (circle, value) => circle.setCenter(toLngLatProp(value)),
    radius: (circle, value) => circle.setRadius(value),
    color: (circle, value) => {
      if (value !== undefined) circle.setColor(value);
    },
    fillColor: (circle, value) => {
      if (value !== undefined) circle.setFillColor(value);
    },
    fillOpacity: (circle, value) => {
      if (value !== undefined) circle.setFillOpacity(value);
    },
  },
});
