import { compact } from "@tianditu/core";
import { shallowRef } from "vue";

import { useMapInstance } from "../useMapInstance";

/**
 * 公交线路检索（官方 BusLineSearch）：官方双回调包装为响应式
 * busList / busLine。
 */
export function useBusLineSearch() {
  const busList = shallowRef<T.BusListResult>();
  const busLine = shallowRef<T.BusLine>();

  const searcher = useMapInstance(
    (map) =>
      new T.BusLineSearch(
        map,
        compact({
          onGetBusListComplete: (result) => {
            busList.value = result;
          },
          onGetBusLineComplete: (result) => {
            busLine.value = result;
          },
        }),
      ),
  );

  /** 按关键词查询公交线路列表 */
  function getBusList(keyword: string) {
    if (searcher.value) {
      searcher.value.getBusList(keyword);
    }
  }

  /** 查询指定线路详情 */
  function getBusLine(item: T.BusListItem) {
    if (searcher.value) {
      searcher.value.getBusLine(item);
    }
  }

  return { searcher, busList, busLine, getBusList, getBusLine };
}
