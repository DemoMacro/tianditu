import { markerDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 标注组件：定义（props/构造/sync/事件表）见 core defs，vue/wc 共享。
 */
export type { MarkerProps } from "@tianditu/core";

export const TdtMarker = defineOverlayComponent(markerDef);
