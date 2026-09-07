import { compact, toLngLat } from "@tianditu/core";
import { useState } from "react";

import { useSdkInstance } from "../useSdkInstance";

/**
 * 公交换乘规划（官方 TransitRoute）：onSearchComplete 包装为 results
 * 状态，起终点支持 [lng, lat] 数组。
 */
export function useTransitRoute(policy: T.TransitRouteOptions["policy"]) {
  const [results, setResults] = useState<T.TransitRouteResult | undefined>(undefined);

  const router = useSdkInstance(
    (map) =>
      new T.TransitRoute(
        map,
        compact({
          policy,
          onSearchComplete: (result) => {
            setResults(result);
          },
        }),
      ),
  );

  function search(start: T.LngLat | [number, number], end: T.LngLat | [number, number]) {
    if (!router) {
      return;
    }
    router.search(toLngLat(start), toLngLat(end));
  }

  return { router, results, search };
}
