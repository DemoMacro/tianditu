export {};

declare global {
  namespace T {
    /** 此类用于获取行政区划信息 */
    class AdministrativeDivision {
      /** 创建一个获取行政区划的实例 */
      constructor();

      /** 根据检索词发起检索（官方回调参数标注为 Function） */
      search(
        config: AdministrativeDivisionOptions,
        callback: (result: AdministrativeDivisionResult) => void,
      ): void;
    }

    interface AdministrativeDivisionOptions {
      /** 查询行政区划的名称 */
      searchWord: string;
      /** 查询类型：0 根据 code 查询、1 根据名称查询 */
      searchType: number;
      /** 是否需要下一级信息 */
      needSubInfo?: boolean;
      /** 是否需要所有子节点 */
      needAll?: boolean;
      /** 是否需要行政区划范围 */
      needPolygon?: boolean;
      /** 是否需要上一级所有信息 */
      needPre?: boolean;
    }

    /** AdministrativeDivision 的检索结果，没有构造函数 */
    interface AdministrativeDivisionResult {
      /** 返回状态码：100 正常、101 没有查到结果（官方类型标注笔误为 numer） */
      getStatus(): number;
      /** 返回响应信息 */
      getMsg(): string;
      /** 数据版本（官方返回值标注为 LngLat，疑为笔误，实际为日期字符串） */
      getDataVersion(): string;
      /**
       * 返回行政区划数据信息 JSON 文本，结构：
       * {returncode, data: [{parents, country, level, nameabbrevation, name,
       * adminType, cityCode, lnt, lat, englishabbrevation, english, bound, points}], dataversion, msg}
       */
      getData(): string;
    }
  }
}
