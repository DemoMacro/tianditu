import { circleDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/** 圆形组件：定义见 core defs，适配层共享 */
export type { CircleProps, LineStyleProps } from "@tianditu/core";

export const TdtCircle = defineOverlayComponent(circleDef);
