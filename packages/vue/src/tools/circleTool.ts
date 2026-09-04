import { compact } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

export interface CircleToolProps {
  color?: string;
  weight?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  lineStyle?: "solid" | "dashed";
}

export const TdtCircleTool = defineToolComponent<CircleToolProps>({
  name: "TdtCircleTool",
  props: {
    color: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
    lineStyle: { type: String, default: undefined },
  },
  events: ["draw", "drawend"] as const,
  create: (props, map) =>
    new T.CircleTool(
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
