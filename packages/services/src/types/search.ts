/**
 * 地名搜索 V2.0（官方文档 server/search2.html）。
 * 端点 /v2/search?type=query，postStr 为 JSON 串。
 */

/**
 * 搜索请求参数。必填项随 queryType 不同：
 * - 1 普通：start/count
 * - 2 视野内 / 10 多边形：mapBound、level
 * - 3 周边：mapBound、level、pointLonlat、queryRadius
 * - 12 行政区划区域：specify
 * - 13 数据分类：specify、dataTypes
 * - 14 统计：specify
 */
export interface SearchPostStr {
  /** 搜索的关键字 */
  keyWord: string;
  /**
   * 查询类型：1 普通（含地铁公交）、2 视野内、3 周边、10 多边形、
   * 12 行政区划区域、13 数据分类、14 统计
   */
  queryType: 1 | 2 | 3 | 10 | 12 | 13 | 14;
  /** 返回结果起始位（0-300），默认 0 */
  start?: number;
  /** 返回结果条数（1-300） */
  count?: number;
  /** 指定行政区国标码（9 位）或名称，如 "156110000" */
  specify?: string;
  /** 地图视野范围 "minx,miny,maxx,maxy"（-180,-90 至 180,90） */
  mapBound?: string;
  /** 目前查询的级别（1-18） */
  level?: number;
  /** 周边搜索中心点坐标 "lng,lat" */
  pointLonlat?: string;
  /** 周边搜索半径 */
  queryRadius?: string;
  /** 多边形搜索顶点串 "lng,lat;lng,lat;..." */
  polygon?: string;
  /** 数据分类（分类名称或编码，多个以英文逗号隔开） */
  dataTypes?: string;
  /** poi 结果信息类别：1 基本信息、2 详细信息 */
  show?: 1 | 2;
}

export interface SearchResult {
  /** 结果类型：1 普通 POI、2 统计、3 行政区、4 建议词、5 线路 */
  resultType: 1 | 2 | 3 | 4 | 5;
  /** 返回总条数 */
  count: number;
  /** 搜索关键词 */
  keyword: string;
  /** POI 集合（resultType=1） */
  pois?: SearchPoi[];
  /** 统计集合（resultType=2） */
  statistics?: SearchStatistics[];
  /** 行政区集合（resultType=3） */
  area?: SearchArea[];
  /** 建议词（resultType=4；官方类型标注为 json，集合形式待真实环境验证） */
  suggests?: SearchSuggest | SearchSuggest[];
  /** 提示信息（需要提示时返回） */
  prompt?: SearchPrompt;
  /** 线路结果（resultType=5） */
  lineData?: SearchLineData[];
  /** 结果提示信息 */
  status: SearchResultStatus;
}

export interface SearchPoi {
  /** poi 点名称 */
  name: string;
  /** 电话 */
  phone?: string;
  /** 地址 */
  address?: string;
  /** 坐标 "x,y" */
  lonlat: string;
  /** poi 类型：101 POI 数据、102 公交站点 */
  poiType: 101 | 102;
  /** 英文地址 */
  eaddress?: string;
  /** poi 点英文名称 */
  ename?: string;
  /** poi 热点 ID */
  hotPointID: string;
  /** 所属省名称 */
  province?: string;
  /** 省行政区编码 */
  provinceCode?: string;
  /** 所属城市名称 */
  city?: string;
  /** 市行政区编码 */
  cityCode?: string;
  /** 所属区县名称 */
  county?: string;
  /** 区县行政区编码 */
  countyCode?: string;
  /** 数据信息来源 */
  source: string;
  /** 分类编码 */
  typeCode?: string;
  /** 分类名称 */
  typeName?: string;
  /** 车站信息（poiType=102） */
  stationData?: SearchStationData[];
  /** 公交站 uuid */
  stationUuid?: string;
}

export interface SearchStationData {
  /** 线路名称 */
  lineName: string;
  /** 线路的 id */
  uuid: string;
}

export interface SearchStatistics {
  /** 本次统计 POI 总数量 */
  count: number;
  /** 行政区数量 */
  adminCount: number;
  /** 推荐行政区集合 */
  priorityCitys: SearchPriorityCity[];
  /** 各省包含信息集合 */
  allAdmins: SearchAdmin[];
}

export interface SearchPriorityCity {
  /** 行政区名称 */
  name: string;
  /** 城市数量 */
  count: number;
  /** 行政区经纬度 "x,y" */
  lonlat: string;
  /** 英文行政名称 */
  ename: string;
  /** 城市国标码（9 位） */
  adminCode: number;
}

export interface SearchAdmin {
  /** 行政名称 */
  name: string;
  /** 包含数量 */
  count: number;
  /** 行政区经纬度 "x,y" */
  lonlat: string;
  /** 省国标码 */
  adminCode: string;
  /** 英文行政名称 */
  ename: string;
  /** 有无下一级行政区：有则 false，无则 true */
  isleaf: boolean;
}

export interface SearchArea {
  /** 名称 */
  name: string;
  /** 定位范围 "minx,miny,maxx,maxy" */
  bound?: string;
  /** 定位中心点坐标 "x,y" */
  lonlat: string;
  /** 行政区编码 */
  adminCode: number;
  /** 显示级别（1-18） */
  level: number;
}

export interface SearchSuggest {
  /** 名称 */
  name: string;
  /** 地区地址（可能为空串） */
  address: string;
  /** 国标码 */
  gbCode: string;
}

export interface SearchPrompt {
  /** 提示类型：1 是否在 where 搜 what、2 在 where 无结果、3 多个可跳转行政区、4 城市 */
  type: 1 | 2 | 3 | 4;
  /** 提示的行政区集合 */
  admins: SearchPromptAdmin[];
  /** 关键字 */
  keyword: string;
}

export interface SearchPromptAdmin {
  /** 行政区名称 */
  adminName: string;
  /** 行政区划编码 */
  adminCode: string;
}

export interface SearchLineData {
  /** 站数量 */
  stationNum: string;
  /** 类型，官方标注为 "103" */
  poiType: string;
  /** 线路名称 */
  name: string;
  /** 线路 id */
  uuid: string;
}

export interface SearchResultStatus {
  /** 服务状态码（1000 正常，2001-2007 参数错误，3000 服务错误，3001 无数据） */
  infocode: number;
  /** 返回中文描述 */
  cndesc: string;
}
