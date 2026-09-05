import { useMapInstance } from "../useMapInstance";

/**
 * 行政区划查询（官方 AdministrativeDivision）：构造无参、不依赖地图
 * 实例，经地图上下文等待 SDK 就绪后构造；search 的回调转写为 Promise。
 */
export function useAdministrativeDivision() {
  const division = useMapInstance(() => new T.AdministrativeDivision());

  /** 根据检索词发起检索（结果 getStatus() 100 正常、101 没有查到结果） */
  function search(
    config: T.AdministrativeDivisionOptions,
  ): Promise<T.AdministrativeDivisionResult | null> {
    return new Promise((resolve) => {
      if (!division.value) {
        resolve(null);
        return;
      }
      division.value.search(config, (result) => resolve(result));
    });
  }

  return { division, search };
}
