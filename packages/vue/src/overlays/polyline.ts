import { polylineDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/** 折线组件：定义（含线样式四件套）见 core defs，vue/wc 共享 */
export type { LineStyleProps, PolylineProps } from "@tianditu/core";

export const TdtPolyline = defineOverlayComponent(polylineDef);
