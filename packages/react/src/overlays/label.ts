import { labelDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/** 文本标注组件：定义见 core defs，适配层共享 */
export type { LabelProps } from "@tianditu/core";

export const TdtLabel = defineOverlayComponent(labelDef);
