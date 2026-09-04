import { compact, toLngLat } from "@tianditu/core";
import { inject, shallowRef, watch, type ShallowRef } from "vue";

import { MAP_KEY } from "../context";

/**
 * 位置检索（官方 LocalSearch）：构造与 onSearchComplete 回调包装为响应式
 * results，检索方法与官方同名。
 */
export function useLocalSearch(options?: { pageCapacity?: number }) {
  const { map } = inject(MAP_KEY)!;
  const searcher = shallowRef<T.LocalSearch>();
  const results = shallowRef<T.LocalSearchResult>();
  const status = shallowRef<"idle" | "loading" | "done">("idle");

  watch(
    map,
    (current) => {
      if (!current || searcher.value) {
        return;
      }
      searcher.value = new T.LocalSearch(
        current,
        compact({
          pageCapacity: options?.pageCapacity,
          onSearchComplete: (result) => {
            results.value = result;
            status.value = "done";
          },
        }),
      );
    },
    { immediate: true },
  );

  function run(invoke: (searcher: T.LocalSearch) => void) {
    if (!searcher.value) {
      return;
    }
    status.value = "loading";
    invoke(searcher.value);
  }

  /** 关键词检索，type 为官方检索类型，缺省普通搜索 */
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
