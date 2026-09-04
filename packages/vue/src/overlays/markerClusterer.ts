import { provide } from "vue";

import { CLUSTER_KEY } from "../context";
import { defineOverlayComponent } from "../defineOverlayComponent";

export interface MarkerClusterProps {
  /** 聚合计算网格的像素大小，默认 60（SDK 拼写为 girdSize） */
  gridSize?: number;
  /** 大于该级别不进行聚合 */
  maxZoom?: number;
  styles?: T.MarkerClustererStyle[];
}

export const TdtMarkerCluster = defineOverlayComponent<MarkerClusterProps, T.MarkerClusterer>({
  name: "TdtMarkerCluster",
  props: {
    gridSize: { type: Number, default: undefined },
    maxZoom: { type: Number, default: undefined },
    styles: { type: Array, default: undefined },
  },
  events: ["clusterclick", "dragstart", "drag", "dragend"] as const,
  // 点聚合在 SDK 内自行管理展示，不走 removeOverLay
  detach(cluster) {
    cluster.clearMarkers();
  },
  setup({ instance }) {
    // 向子级 TdtMarker 提供收集器：嵌套的 Marker 加入聚合而非直接上屏
    provide(CLUSTER_KEY, {
      addMarker: (marker) => instance.value?.addMarker(marker),
      removeMarker: (marker) => instance.value?.removeMarker(marker),
    });
  },
  create(props, { map }) {
    return new T.MarkerClusterer(map, {
      girdSize: props.gridSize,
      maxZoom: props.maxZoom,
      styles: props.styles,
    });
  },
  sync: {
    gridSize: (cluster, value) => {
      if (value !== undefined) cluster.setGridSize(value);
    },
    maxZoom: (cluster, value) => {
      if (value !== undefined) cluster.setMaxZoom(value);
    },
    styles: (cluster, value) => {
      if (value !== undefined) cluster.setStyles(value);
    },
  },
});
