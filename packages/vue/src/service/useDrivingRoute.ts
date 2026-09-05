import { compact, toLngLat } from "@tianditu/core";
import { shallowRef } from "vue";

import { useMapInstance } from "../useMapInstance";

/**
 * 驾车路线规划（官方 DrivingRoute）：onSearchComplete 包装为响应式 results，
 * 起终点支持 [lng, lat] 数组。
 */
export function useDrivingRoute(policy: T.DrivingRouteOptions["policy"]) {
  const results = shallowRef<T.DrivingRouteResult>();

  const router = useMapInstance(
    (map) =>
      new T.DrivingRoute(
        map,
        compact({
          policy,
          onSearchComplete: (result) => {
            results.value = result;
          },
        }),
      ),
  );

  function search(start: T.LngLat | [number, number], end: T.LngLat | [number, number]) {
    if (!router.value) {
      return;
    }
    router.value.search(toLngLat(start), toLngLat(end));
  }

  return { router, results, search };
}
