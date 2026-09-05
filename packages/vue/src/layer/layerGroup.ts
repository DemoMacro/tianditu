import { provide } from "vue";

import { LAYER_GROUP_KEY } from "../context";
import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 图层容器（官方 LayerGroup）：存储 T.Overlay 继承的图层。子级覆盖物组件
 * 经 provide 的收集器加入容器；容器销毁时清空全部子级。
 */
export const TdtLayerGroup = defineOverlayComponent<Record<string, never>, T.LayerGroup>({
  name: "TdtLayerGroup",
  props: {},
  setup({ instance }) {
    provide(LAYER_GROUP_KEY, {
      addMarker: (marker) => instance.value?.addLayer(marker as unknown as T.Overlay),
      removeMarker: (marker) => instance.value?.removeLayer(marker as unknown as T.Overlay),
    });
  },
  create: () => new T.LayerGroup([]),
  detach(group) {
    group.clearLayers();
  },
});
