/**
 * 瓦片图层的挂载与事件编排。图层构造（TileLayer/TileLayerWMS/GridlineLayer）
 * 由调用方完成，此处统一处理上屏、事件挂接与卸载。
 */

import { bindEventNames } from "./events";

export const TILE_LAYER_EVENT_NAMES = [
  "loading",
  "load",
  "tileloadstart",
  "tileload",
  "tileunload",
  "tileerror",
] as const;

export interface TileLayerMountOptions {
  map: T.Map;
  layer: T.TileLayer;
  /** 默认为全部瓦片图层事件 */
  events?: readonly string[];
  dispatch: (name: string, event: unknown) => void;
}

/** 挂接事件并上屏，返回卸载函数（解绑事件 + removeLayer） */
export function mountTileLayer(options: TileLayerMountOptions): () => void {
  const { map, layer } = options;
  const unbind = bindEventNames(layer, options.events ?? TILE_LAYER_EVENT_NAMES, options.dispatch);
  map.addLayer(layer);
  return () => {
    unbind();
    map.removeLayer(layer);
  };
}
