import { compact, toLngLat } from "@tianditu/core";
import { shallowRef } from "vue";

import { useMapInstance } from "../useMapInstance";

/**
 * 公交换乘规划（官方 TransitRoute）：onSearchComplete 包装为响应式 results，
 * 起终点支持 [lng, lat] 数组。
 */
export function useTransitRoute(policy: T.TransitRouteOptions["policy"]) {
  const results = shallowRef<T.TransitRouteResult>();

  const router = useMapInstance(
    (map) =>
      new T.TransitRoute(
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
