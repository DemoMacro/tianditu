import { createWhenReady } from "@tianditu/core";
import { inject, shallowRef, watch, type ShallowRef } from "vue";

import { MAP_KEY } from "./context";

/**
 * map 就绪后守卫构造 SDK 实例并缓存：SDK 扩展组件包异步加载且无整体
 * 就绪回调，构造过早会抛 "is not a constructor"，经 createWhenReady 重试。
 * 无参构造的服务类（如 Geocoder）同样经此等待 SDK 就绪。
 */
export function useMapInstance<T>(construct: (map: T.Map) => T): ShallowRef<T | undefined> {
  const { map } = inject(MAP_KEY)!;
  const instance = shallowRef<T>();

  watch(
    map,
    (current) => {
      if (!current || instance.value) {
        return;
      }
      void createWhenReady(() => construct(current)).then((created) => {
        if (!instance.value) {
          instance.value = created;
        }
      });
    },
    { immediate: true },
  );

  return instance;
}
