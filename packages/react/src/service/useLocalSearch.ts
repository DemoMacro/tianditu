import { compact, toLngLat } from "@tianditu/core";
import { useState } from "react";

import { useSdkInstance } from "../useSdkInstance";

/**
 * 位置检索（官方 LocalSearch）：构造与 onSearchComplete 回调包装为
 * results 状态，检索方法与官方同名。
 */
export function useLocalSearch(options?: { pageCapacity?: number }) {
  const [results, setResults] = useState<T.LocalSearchResult | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const searcher = useSdkInstance(
    (map) =>
      new T.LocalSearch(
        map,
        compact({
          pageCapacity: options?.pageCapacity,
          onSearchComplete: (result) => {
            setResults(result);
            setStatus("done");
          },
        }),
      ),
  );

  function run(invoke: (searcher: T.LocalSearch) => void) {
    if (!searcher) {
      return;
    }
    setStatus("loading");
    invoke(searcher);
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
      setResults(undefined);
      setStatus("idle");
    });

  return {
    searcher,
    results,
    status,
    search,
    searchInBounds,
    searchNearby,
    gotoPage,
    clearResults,
  };
}
