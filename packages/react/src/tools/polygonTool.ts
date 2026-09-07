import { polygonToolDef } from "@tianditu/core";

import { defineToolComponent } from "../defineToolComponent";

/** 测面工具：定义见 core defs，适配层共享 */
export type { PolygonToolProps } from "@tianditu/core";

export const TdtPolygonTool = defineToolComponent(polygonToolDef);
