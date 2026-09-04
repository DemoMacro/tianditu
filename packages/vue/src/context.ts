import type { OverlayCollector } from "@tianditu/core";
import type { InjectionKey, ShallowRef } from "vue";

/** TdtMap 组件向子组件注入的地图上下文 */
export interface MapContext {
  /** 地图实例，就绪前为 undefined */
  map: ShallowRef<T.Map | undefined>;
  /** 地图会话是否已建立 */
  ready: ShallowRef<boolean>;
}

export const MAP_KEY: InjectionKey<MapContext> = Symbol("tianditu:map");

/** 覆盖物组件向子级（InfoWindow 等）注入的宿主实例 */
export const OVERLAY_KEY: InjectionKey<ShallowRef<unknown | undefined>> =
  Symbol("tianditu:overlay");

/** MarkerClusterer 向子级 Marker 提供的收集器（形状同 core 的 OverlayCollector） */
export type MarkerCollector = OverlayCollector;

export const CLUSTER_KEY: InjectionKey<MarkerCollector> = Symbol("tianditu:cluster");
