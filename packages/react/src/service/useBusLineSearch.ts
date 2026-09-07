import { compact } from "@tianditu/core";
import { useState } from "react";

import { useSdkInstance } from "../useSdkInstance";

/**
 * 公交线路检索（官方 BusLineSearch）：官方双回调包装为 busList / busLine
 * 状态。
 */
export function useBusLineSearch() {
  const [busList, setBusList] = useState<T.BusListResult | undefined>(undefined);
  const [busLine, setBusLine] = useState<T.BusLine | undefined>(undefined);

  const searcher = useSdkInstance(
    (map) =>
      new T.BusLineSearch(
        map,
        compact({
          onGetBusListComplete: (result) => {
            setBusList(result);
          },
          onGetBusLineComplete: (result) => {
            setBusLine(result);
          },
        }),
      ),
  );

  /** 按关键词查询公交线路列表 */
  function getBusList(keyword: string) {
    searcher?.getBusList(keyword);
  }

  /** 查询指定线路详情 */
  function getBusLine(item: T.BusListItem) {
    searcher?.getBusLine(item);
  }

  return { searcher, busList, busLine, getBusList, getBusLine };
}
