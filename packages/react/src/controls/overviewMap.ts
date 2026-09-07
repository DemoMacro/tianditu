import { overviewMapDef } from "@tianditu/core";

import { defineControlComponent } from "../defineControlComponent";

/** 鹰眼控件：定义见 core defs，适配层共享 */
export type { ControlOverviewMapProps } from "@tianditu/core";

export const TdtControlOverviewMap = defineControlComponent(overviewMapDef);
