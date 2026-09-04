import { compact } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

export interface PaintBrushToolProps {
  /** 保持工具的连续可用性 */
  keepdrawing?: boolean;
  /** 笔迹样式 */
  color?: string;
  weight?: number;
  opacity?: number;
}

export const TdtPaintBrushTool = defineToolComponent<PaintBrushToolProps>({
  name: "TdtPaintBrushTool",
  props: {
    keepdrawing: { type: Boolean, default: undefined },
    color: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
  },
  create: (props, map) =>
    new T.PaintBrushTool(
      map,
      compact({
        keepdrawing: props.keepdrawing,
        style: {
          color: props.color,
          weight: props.weight,
          opacity: props.opacity,
        },
      }),
    ),
});
