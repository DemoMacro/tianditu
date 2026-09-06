import { zoomDef } from "@tianditu/core";

import { defineControlComponent } from "./defineControlComponent";

/** 缩放控件：定义见 core defs，vue/wc 共享 */
export type { ControlZoomProps } from "@tianditu/core";

export const TdtControlZoom = defineControlComponent(zoomDef);
