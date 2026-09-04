import { inject, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";

/**
 * 公交线路检索（官方 BusLineSearch）：官方双回调包装为响应式
 * busList / busLine。
 */
export function useBusLineSearch() {
  const { map } = inject(MAP_KEY)!;
  const searcher = shallowRef<T.BusLineSearch>();
  const busList = shallowRef<T.BusListResult>();
  const busLine = shallowRef<T.BusLine>();

  watch(
    map,
    (current) => {
      if (!current || searcher.value) {
        return;
      }
      searcher.value = new T.BusLineSearch(current, {
        onGetBusListComplete: (result) => {
          busList.value = result;
        },
        onGetBusLineComplete: (result) => {
          busLine.value = result;
        },
      });
    },
    { immediate: true },
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
