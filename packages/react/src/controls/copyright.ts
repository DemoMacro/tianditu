import { copyrightDef } from "@tianditu/core";

import { defineControlComponent } from "../defineControlComponent";

/** 版权控件：定义见 core defs，适配层共享 */
export type { ControlCopyrightProps } from "@tianditu/core";

export const TdtControlCopyright = defineControlComponent(copyrightDef);
