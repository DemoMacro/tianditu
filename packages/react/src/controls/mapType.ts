import { mapTypeDef } from "@tianditu/core";

import { defineControlComponent } from "../defineControlComponent";

/** 地图类型切换控件：定义见 core defs，适配层共享 */
export type { ControlMapTypeProps } from "@tianditu/core";

export const TdtControlMapType = defineControlComponent(mapTypeDef);
