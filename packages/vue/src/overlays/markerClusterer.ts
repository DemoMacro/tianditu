import { markerClustererDef } from "@tianditu/core";
import { provide } from "vue";

import { CLUSTER_KEY } from "../context";
import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 点聚合：向子级 TdtMarker 提供收集器，嵌套的 Marker 加入聚合而非直接
 * 上屏。定义（含 detach=clearMarkers）见 core defs，vue/wc 共享。
 */
export type { MarkerClustererProps } from "@tianditu/core";

export const TdtMarkerCluster = defineOverlayComponent(markerClustererDef, {
  setup({ instance }) {
    provide(CLUSTER_KEY, {
      addMarker: (marker) => instance.value?.addMarker(marker),
      removeMarker: (marker) => instance.value?.removeMarker(marker),
    });
  },
});
