import { compact, toLngLat } from "@tianditu/core";
import { provide, type PropType } from "vue";

import { CLUSTER_KEY } from "../context";
import { defineOverlayComponent } from "../defineOverlayComponent";

export interface MarkerClusterProps {
  /** 批量传入的待聚合标注（官方 MarkerClustererOptions.markers） */
  markers?: Array<T.Marker | [number, number]>;
  /** 聚合计算网格的像素大小，默认 60（SDK 拼写为 girdSize） */
  gridSize?: number;
  /** 大于该级别不进行聚合 */
  maxZoom?: number;
  styles?: T.MarkerClustererStyle[];
}

function toMarkers(value: NonNullable<MarkerClusterProps["markers"]>): T.Marker[] {
  return value.map((item) =>
    Array.isArray(item) ? new T.Marker(toLngLat(item)) : (item as T.Marker),
  );
}

export const TdtMarkerCluster = defineOverlayComponent<MarkerClusterProps, T.MarkerClusterer>({
  name: "TdtMarkerCluster",
  props: {
    markers: {
      type: Array as unknown as PropType<MarkerClusterProps["markers"]>,
      default: undefined,
    },
    gridSize: { type: Number, default: undefined },
    maxZoom: { type: Number, default: undefined },
    styles: { type: Array, default: undefined },
  },
  // 官方 MarkerClusterer 页未列事件表；个别交互事件可经 expose 的
  // cluster 实例用官方 addEventListener 命令式挂接
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
    const cluster = new T.MarkerClusterer(
      map,
      compact({
        girdSize: props.gridSize,
        maxZoom: props.maxZoom,
        styles: props.styles,
      }),
    );
    if (props.markers?.length) {
      cluster.addMarkers(toMarkers(props.markers));
    }
    return cluster;
  },
  sync: {
    markers: (cluster, value) => {
      if (value) {
        // 官方无整体替换方法：清空后重建
        cluster.clearMarkers();
        cluster.addMarkers(toMarkers(value));
      }
    },
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
