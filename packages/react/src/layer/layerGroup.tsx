import { layerGroupDef, type OverlayCollector } from "@tianditu/core";

import { LayerGroupContext } from "../context";
import { defineOverlayComponent } from "../defineOverlayComponent";

/**
 * 图层容器（官方 LayerGroup）：存储 T.Overlay 继承的图层。子级覆盖物组件
 * 经 Context 提供的收集器加入容器；容器销毁时清空全部子级。
 * 定义见 core defs，适配层共享。
 */
export const TdtLayerGroup = defineOverlayComponent(layerGroupDef, {
  setup({ instanceRef }) {
    const collector: OverlayCollector = {
      addMarker: (marker) => instanceRef.current?.addLayer(marker as unknown as T.Overlay),
      removeMarker: (marker) => instanceRef.current?.removeLayer(marker as unknown as T.Overlay),
    };
    return (children) => (
      <LayerGroupContext.Provider value={collector}>{children}</LayerGroupContext.Provider>
    );
  },
});
