/**
 * 行政区划 V2.0（官方文档 server/administrative2.html）。
 * 端点 /v2/administrative，query 参数风格。
 */

export interface AdministrativeParams {
  /**
   * 行政区划名称或编码；仅名称支持模糊查询。
   * 仅一个字符时只返回 suggestion 字段，不返回 district 字段。
   */
  keyword: string;
  /** 显示下级行政区级数：0 不返回、1 下一级、2 下两级、3 下三级 */
  childLevel?: 0 | 1 | 2 | 3;
  /** 是否需要轮廓数据 */
  extensions?: boolean;
}

export interface AdministrativeResult {
  /** 返回描述 */
  message: string;
  /** 0 正常（官方文档同页亦标注 100/101 码表，以实际响应为准） */
  status: number;
  /** 行政区划信息 */
  data: AdministrativeData;
}

export interface AdministrativeData {
  /** 建议搜索词（模糊匹配多条时返回；仅一条时为空） */
  suggestion: string[];
  /** 行政区划信息 */
  district: AdministrativeDistrict[];
}

export interface AdministrativeDistrict {
  /** 行政区划名称 */
  name: string;
  /** 行政区划编码 */
  gb: string;
  /** 轮廓数据（extensions=true 时返回） */
  boundary?: string;
  /** 中心点坐标 */
  center: AdministrativeCenter;
  /** 行政区划级别：5 国家级、4 省级、3 市级、2 区县级 */
  level: 2 | 3 | 4 | 5;
  /** 下级行政区划信息 */
  children: AdministrativeChild[];
}

export interface AdministrativeChild {
  /** 行政区划名称 */
  name: string;
  /** 行政区划编码 */
  gb: string;
  /** 中心点坐标 */
  center: AdministrativeCenter;
  /** 行政区划级别：5 国家级、4 省级、3 市级、2 区县级 */
  level: 2 | 3 | 4 | 5;
  /** 下级行政区划信息 */
  children: AdministrativeChild[];
}

export interface AdministrativeCenter {
  /** 经度 */
  lng: number;
  /** 纬度 */
  lat: number;
}
