import { compact } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

export interface PaintBrushToolProps {
  /** 保持工具的连续可用性 */
  keepdrawing?: boolean;
  /** 画笔留下笔迹的样式（官方 PaintBrushToolOptions 的 style 字段） */
  style?: T.PaintBrushToolOptions["style"];
}

export const TdtPaintBrushTool = defineToolComponent<PaintBrushToolProps>({
  name: "TdtPaintBrushTool",
  props: {
    keepdrawing: { type: Boolean, default: undefined },
    style: { type: Object, default: undefined },
  },
  create: (props, map) =>
    new T.PaintBrushTool(
      map,
      compact({
        keepdrawing: props.keepdrawing,
        style: props.style,
      }),
    ),
});
