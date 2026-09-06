import { circleDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/** 圆形组件：定义见 core defs，vue/wc 共享 */
export type { CircleProps, LineStyleProps } from "@tianditu/core";

export const TdtCircle = defineOverlayComponent(circleDef);
