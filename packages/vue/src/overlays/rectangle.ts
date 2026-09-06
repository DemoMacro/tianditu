import { rectangleDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/** 矩形组件：定义见 core defs，vue/wc 共享 */
export type { LineStyleProps, RectangleProps } from "@tianditu/core";

export const TdtRectangle = defineOverlayComponent(rectangleDef);
