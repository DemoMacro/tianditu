/**
 * 地理编码（官方文档 server/geocodinginterface.html 正向、server/geocoding.html 逆向）。
 * 端点均为 /geocoder：正向 ds 参数、逆向 postStr 参数（type=geocode）。
 */

/** 正向地理编码请求 */
export interface GeoCodingDs {
  /** 请求关键字（结构化地址，仅限国内） */
  keyWord: string;
}

export interface GeoCodingResult {
  /** 返回状态：0 正常、101 结果为空、404 出错 */
  status: string;
  /** 返回信息：OK 正常，其他异常 */
  msg: string;
  /** 地址信息 */
  location: GeoCodingLocation;
}

export interface GeoCodingLocation {
  /** 坐标点显示经度 */
  lon: number;
  /** 坐标点显示纬度 */
  lat: number;
  /** 类别名称 */
  level?: string;
  /** 附近相似点（开启周边查询时返回） */
  typeRound?: unknown[];
}

/** 逆地理编码请求 */
export interface ReverseGeoCodingPostStr {
  /** 坐标的 x 值 */
  lon: number;
  /** 坐标的 y 值 */
  lat: number;
  /** 接口版本，默认 1 */
  ver?: number;
}

export interface ReverseGeoCodingResult {
  /** 状态：0 正确、1 错误、404 出错 */
  status: string;
  /** 响应信息（OK 为有信息） */
  msg: string;
  /** 响应的具体信息（有结果时返回） */
  result?: ReverseGeoCodingDetail;
}

export interface ReverseGeoCodingDetail {
  /** 此点的具体信息（分类） */
  addressComponent: ReverseGeoCodingAddressComponent;
  /** 详细地址 */
  formatted_address: string;
  /** 此点坐标 */
  location: ReverseGeoCodingPoint;
}

export interface ReverseGeoCodingAddressComponent {
  /** 此点最近地点信息 */
  address: string;
  /** 距最近地点信息的距离 */
  address_distince: number;
  /** 此点在最近地点信息的方向 */
  address_position: string;
  /** 此点所在国家或城市或区县 */
  city: string;
  /** 距离此点最近的 poi 点 */
  poi: string;
  /** 距最近 poi 点的距离 */
  poi_distince: number;
  /** 此点在最近 poi 点的方向 */
  poi_position: string;
  /** 距离此点最近的路 */
  road: string;
  /** 此点距此路的距离 */
  road_distince: number;
}

export interface ReverseGeoCodingPoint {
  /** 此点坐标 x 值 */
  lon: string;
  /** 此点坐标 y 值 */
  lat: string;
}
