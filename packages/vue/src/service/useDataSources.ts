import { useMapInstance } from "../useMapInstance";

/**
 * 数据来源查询（官方 DataSources）：构造无参、不依赖地图实例，经地图
 * 上下文等待 SDK 就绪后构造；search 的回调转写为 Promise。
 */
export function useDataSources() {
  const dataSources = useMapInstance(() => new T.DataSources());

  /** 查询当前地图数据的来源，结果为 {ds: "数据来源"} */
  function search(config: T.DataSourcesOptions): Promise<T.DataSourcesResult | null> {
    return new Promise((resolve) => {
      if (!dataSources.value) {
        resolve(null);
        return;
      }
      dataSources.value.search(config, (result) => resolve(result));
    });
  }

  return { dataSources, search };
}
