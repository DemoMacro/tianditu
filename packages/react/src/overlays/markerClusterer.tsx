import { markerClustererDef, type OverlayCollector } from "@tianditu/core";

import { ClusterContext } from "../context";
import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 点聚合：向子级 TdtMarker 提供收集器，嵌套的 Marker 加入聚合而非直接
 * 上屏。定义（含 detach=clearMarkers）见 core defs，适配层共享。
 */
export type { MarkerClustererProps } from "@tianditu/core";

export const TdtMarkerCluster = defineOverlayComponent(markerClustererDef, {
  setup({ instanceRef }) {
    const collector: OverlayCollector = {
      addMarker: (marker) => instanceRef.current?.addMarker(marker),
      removeMarker: (marker) => instanceRef.current?.removeMarker(marker),
    };
    return (children) => (
      <ClusterContext.Provider value={collector}>{children}</ClusterContext.Provider>
    );
  },
});
