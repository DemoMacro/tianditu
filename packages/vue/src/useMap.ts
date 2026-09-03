import { inject } from "vue";

import { MAP_KEY, type MapContext } from "./context";

/**
 * 命令式逃生舱：在 TdtMap 内部获取地图实例，覆盖组件化不便的长尾 API。
 *
 * const { map, ready } = useMap();
 * watchEffect(() => { if (map.value) map.value.panTo(new T.LngLat(116, 39)); });
 */
export function useMap(): MapContext {
  const context = inject(MAP_KEY);
  if (!context) {
    throw new Error("[tianditu] useMap 必须在 <TdtMap> 内部调用");
  }
  return context;
}
