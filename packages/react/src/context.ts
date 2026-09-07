import type { OverlayCollector } from "@tianditu/core";
import { createContext, useContext } from "react";

/**
 * 对应 vue 适配层 context.ts 的四个 inject key。地图就绪时序靠 Context
 * value 替换表达：map 从 undefined 变为实例触发 consumer 重渲染，子组件
 * 的 useEffect([map]) 随之重跑——即 vue watch(map, immediate) 的等价物。
 */

/** TdtMap 组件向子组件提供的地图上下文 */
export interface MapContextValue {
  /** 地图实例，就绪前为 undefined */
  map: T.Map | undefined;
  /** 地图会话是否已建立 */
  ready: boolean;
}

export const MapContext = createContext<MapContextValue | undefined>(undefined);

/** 覆盖物组件向子级（InfoWindow 等）提供的宿主实例，就绪前为 undefined */
export const HostContext = createContext<unknown>(undefined);

/** MarkerClusterer 向子级 Marker 提供的收集器（形状同 core 的 OverlayCollector） */
export const ClusterContext = createContext<OverlayCollector | undefined>(undefined);

/** LayerGroup 向子级覆盖物提供的收集器（形状同 core 的 OverlayCollector） */
export const LayerGroupContext = createContext<OverlayCollector | undefined>(undefined);

/** ContextMenu 向子级 MenuItem 提供的菜单实例 */
export const MenuContext = createContext<T.ContextMenu | undefined>(undefined);

/**
 * 命令式逃生舱：在 TdtMap 内部获取地图实例，覆盖组件化不便的长尾 API。
 *
 * const { map, ready } = useMap();
 * useEffect(() => { if (map) map.panTo(new T.LngLat(116, 39)); }, [map]);
 */
export function useMap(): MapContextValue {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("[tianditu] useMap 必须在 <TdtMap> 内部调用");
  }
  return context;
}

/** 覆盖物工厂内部用：就近取收集器（内层容器收编，图层组优先于点聚合） */
export function useCollector(): OverlayCollector | undefined {
  return useContext(LayerGroupContext) ?? useContext(ClusterContext);
}
