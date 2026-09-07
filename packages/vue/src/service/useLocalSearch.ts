import { compact, toLngLat } from "@tianditu/core";
import { shallowRef, type ShallowRef } from "vue";

import { useMapInstance } from "../useMapInstance";

/**
 * 位置检索（官方 LocalSearch）：构造与 onSearchComplete 回调包装为响应式
 * results，检索方法与官方同名。
 */
export function useLocalSearch(options?: { pageCapacity?: number }) {
  const results = shallowRef<T.LocalSearchResult>();
  const status = shallowRef<"idle" | "loading" | "done">("idle");

  const searcher = useMapInstance(
    (map) =>
      new T.LocalSearch(
        map,
        compact({
          pageCapacity: options?.pageCapacity,
          onSearchComplete: (result) => {
            results.value = result;
            status.value = "done";
          },
        }),
      ),
  );

  function run(invoke: (searcher: T.LocalSearch) => void) {
    if (!searcher.value) {
      return;
    }
    status.value = "loading";
    invoke(searcher.value);
  }

  /** 关键词检索，type 为官方检索类型，默认普通搜索 */
  const search = (keyword: string, type?: T.QueryType) =>
    run((s) => s.search(keyword, type ?? "1"));
  const searchInBounds = (keyword: string, bounds: T.LngLatBounds) =>
    run((s) => s.searchInBounds(keyword, bounds));
  const searchNearby = (keyword: string, center: T.LngLat | [number, number], radius: number) =>
    run((s) => s.searchNearby(keyword, toLngLat(center), radius));
  const gotoPage = (page: number) => run((s) => s.gotoPage(page));
  const clearResults = () =>
    run((s) => {
      s.clearResults();
      results.value = undefined;
      status.value = "idle";
    });

  return {
    searcher: searcher as ShallowRef<T.LocalSearch | undefined>,
    results,
    status,
    search,
    searchInBounds,
    searchNearby,
    gotoPage,
    clearResults,
  };
}
