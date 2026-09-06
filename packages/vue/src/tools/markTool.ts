import { markToolDef } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

/** 标注工具：定义见 core defs，vue/wc 共享 */
export type { MarkToolProps } from "@tianditu/core";

export const TdtMarkTool = defineToolComponent(markToolDef);
