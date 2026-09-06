import { paintBrushToolDef } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

/** 画笔工具：定义见 core defs，vue/wc 共享 */
export type { PaintBrushToolProps } from "@tianditu/core";

export const TdtPaintBrushTool = defineToolComponent(paintBrushToolDef);
