import { cloudMarkerDef } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 海量点（官方 CloudMarkerCollection）：万级密集点数据的整批展示。
 * 定义见 core defs，vue/wc 共享。
 */
export type { CloudMarkerProps } from "@tianditu/core";

export const TdtCloudMarker = defineOverlayComponent(cloudMarkerDef);
