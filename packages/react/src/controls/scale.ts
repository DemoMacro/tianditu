import { scaleDef } from "@tianditu/core";

import { defineControlComponent } from "../defineControlComponent";

/** 比例尺控件：定义见 core defs，适配层共享 */
export type { ControlScaleProps } from "@tianditu/core";

export const TdtControlScale = defineControlComponent(scaleDef);
