import { compact } from "@tianditu/core";

import { lineStyleProps } from "../overlays/polyline";
import { defineToolComponent } from "./defineToolComponent";

export interface PolygonToolProps {
  /** 是否显示测面积结果，关闭后可作画多边形工具使用 */
  showLabel?: boolean;
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
}

export const TdtPolygonTool = defineToolComponent<PolygonToolProps>({
  name: "TdtPolygonTool",
  props: {
    showLabel: { type: Boolean, default: undefined },
    ...lineStyleProps,
  },
  events: ["draw", "addpoint"] as const,
  create: (props, map) =>
    new T.PolygonTool(
      map,
      compact({
        showLabel: props.showLabel,
        color: props.color,
        weight: props.weight,
        opacity: props.opacity,
        lineStyle: props.lineStyle,
      }),
    ),
});
