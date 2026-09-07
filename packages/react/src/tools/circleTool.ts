import { circleToolDef } from "@tianditu/core";

import { defineToolComponent } from "../defineToolComponent";

/** 测圆工具：定义见 core defs，适配层共享 */
export type { CircleToolProps } from "@tianditu/core";

export const TdtCircleTool = defineToolComponent(circleToolDef);
