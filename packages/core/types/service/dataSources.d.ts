export {};

declare global {
  namespace T {
    /** 此类用于获取地图数据来源信息 */
    class DataSources {
      /** 创建一个获取数据来源的实例 */
      constructor();

      /** 查询当前地图数据的来源，回调参数为 {ds: "数据来源"} */
      search(config: DataSourcesOptions, callback: (result: DataSourcesResult) => void): void;
    }

    interface DataSourcesOptions {
      /** 地图级别 */
      level?: number;
      /** 地图范围 */
      bound?: string;
      /** 地图图层 */
      layers?: string;
      /** 地图投影 */
      projection?: string;
    }

    interface DataSourcesResult {
      /** 数据来源 */
      ds: string;
    }
  }
}
