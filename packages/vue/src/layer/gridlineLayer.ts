import { gridlineLayerDef } from "@tianditu/core";

import { createTileLayerComponent } from "./tileLayer";

export type { GridlineLayerProps } from "@tianditu/core";

/**
 * 格网图层（官方 GridlineLayer）：官方仅列 loading/load 两个事件，sync
 * 收窄为仅 opacity（官方选项无 url/zIndex）。定义见 core defs，vue/wc 共享。
 */
export const TdtGridlineLayer = createTileLayerComponent(gridlineLayerDef);
