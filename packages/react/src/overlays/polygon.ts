import { polygonDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/** 多边形组件：定义见 core defs，适配层共享 */
export type { LineStyleProps, PolygonProps } from "@tianditu/core";

export const TdtPolygon = defineOverlayComponent(polygonDef);
