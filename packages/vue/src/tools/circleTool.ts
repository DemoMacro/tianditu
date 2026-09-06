import { circleToolDef } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

/** 圆工具：定义见 core defs，vue/wc 共享 */
export type { CircleToolProps } from "@tianditu/core";

export const TdtCircleTool = defineToolComponent(circleToolDef);
