import { compact } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

export interface RectangleToolProps {
  color?: string;
  weight?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  lineStyle?: "solid" | "dashed";
}

export const TdtRectangleTool = defineToolComponent<RectangleToolProps>({
  name: "TdtRectangleTool",
  props: {
    color: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
    lineStyle: { type: String, default: undefined },
  },
  events: ["draw"] as const,
  create: (props, map) =>
    new T.RectangleTool(
      map,
      compact({
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        fillColor: props.fillColor,
        fillOpacity: props.fillOpacity,
        lineStyle: props.lineStyle,
      }),
    ),
});
