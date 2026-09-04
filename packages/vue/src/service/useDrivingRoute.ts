import { compact, toLngLat } from "@tianditu/core";
import { inject, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";

/**
 * 驾车路线规划（官方 DrivingRoute）：onSearchComplete 包装为响应式 results，
 * 起终点支持 [lng, lat] 数组。
 */
export function useDrivingRoute(policy: T.DrivingRouteOptions["policy"]) {
  const { map } = inject(MAP_KEY)!;
  const router = shallowRef<T.DrivingRoute>();
  const results = shallowRef<T.DrivingRouteResult>();

  watch(
    map,
    (current) => {
      if (!current || router.value) {
        return;
      }
      router.value = new T.DrivingRoute(
        current,
        compact({
          policy,
          onSearchComplete: (result) => {
            results.value = result;
          },
        }),
      );
    },
    { immediate: true },
  );

  function search(start: T.LngLat | [number, number], end: T.LngLat | [number, number]) {
    if (!router.value) {
      return;
    }
    router.value.search(toLngLat(start), toLngLat(end));
  }

  return { router, results, search };
}
