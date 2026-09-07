import { polylineToolDef } from "@tianditu/core";

import { defineToolComponent } from "../defineToolComponent";

/** 测距工具：定义见 core defs，适配层共享 */
export type { PolylineToolProps } from "@tianditu/core";

export const TdtPolylineTool = defineToolComponent(polylineToolDef);
