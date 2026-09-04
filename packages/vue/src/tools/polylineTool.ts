import { lineStyleProps } from "../overlays/polyline";
import { defineToolComponent } from "./defineToolComponent";

export interface PolylineToolProps {
  /** 是否显示测距结果，关闭后可作画线工具使用 */
  showLabel?: boolean;
  color?: string;
  weight?: number;
  opacity?: number;
  lineStyle?: "solid" | "dashed";
}

export const TdtPolylineTool = defineToolComponent<PolylineToolProps>({
  name: "TdtPolylineTool",
  props: {
    showLabel: { type: Boolean, default: undefined },
    ...lineStyleProps,
  },
  events: ["draw", "addpoint"] as const,
  create: (props, map) =>
    new T.PolylineTool(map, {
      showLabel: props.showLabel,
      color: props.color,
      weight: props.weight,
      opacity: props.opacity,
      lineStyle: props.lineStyle,
    }),
});
