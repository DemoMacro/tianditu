import { rectangleToolDef } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

/** 矩形工具：定义见 core defs，vue/wc 共享 */
export type { RectangleToolProps } from "@tianditu/core";

export const TdtRectangleTool = defineToolComponent(rectangleToolDef);
