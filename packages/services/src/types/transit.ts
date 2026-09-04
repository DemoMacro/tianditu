/**
 * 公交规划（官方文档 server/bus.html）。
 * 端点 /transit?type=busline，postStr 为 JSON 串。
 */

/** 公交规划请求：线路规划 / uuid 详情查询 / 站点返程查询 三种形态 */
export type TransitPostStr =
  | {
      /** 出发点坐标 "经度,纬度" */
      startposition: string;
      /** 终点坐标 "经度,纬度" */
      endposition: string;
      /**
       * 规划类型（按位组合）：第 0 位较快捷、第 1 位少换乘、
       * 第 2 位少步行、第 3 位不坐地铁
       */
      linetype: string;
    }
  | {
      /** 公交站或线路的 uuid */
      uuid: string;
    }
  | {
      /** 线路 ID */
      lineUuid: string;
      /** 站点 ID */
      stationUuid: string;
    };

export interface TransitResult {
  /**
   * 返回数据状态：0 正常、1 找不到起点、2 找不到终点、3 规划失败、
   * 4 起终点 200 米内建议步行、5 起终点 500 米内、6 参数错误
   */
  resultCode: number;
  /** 返回线路中是否包含地铁：0 不包含、1 包含 */
  hasSubway: 0 | 1;
  /** 各请求类型的返回结果（请求几种返回几种） */
  results: TransitTypeResult[];
}

export interface TransitTypeResult {
  /** 返回线路结果类型（同 linetype 位定义） */
  lineType: number;
  /** 该类型的规划线路（最多 5 条） */
  lines: TransitLine[];
}

export interface TransitLine {
  /** 单条规划结果的线路名称，如 "3路—4路—5路" */
  lineName: string;
  /** 各段线路信息 */
  segments: TransitSegment[];
}

export interface TransitSegment {
  /** 线路类型（1-4） */
  segmentType: number;
  /** 起站点 */
  stationStart: TransitStation;
  /** 终站点 */
  stationEnd: TransitStation;
  /** 线路内容 */
  segmentLine: TransitSegmentLine;
}

export interface TransitStation {
  /** 站点名称 */
  name: string;
  /** 站的 id 信息 */
  uuid: string;
  /** 站点坐标 "x,y" */
  lonlat: string;
}

export interface TransitSegmentLine {
  /** 此段线路名（不含括号内容） */
  segmentName: string;
  /** 此段线路的完整线路名 */
  direction: string;
  /** 此段线路坐标串 */
  linePoint: string;
  /** 此段距离（米）；步行且小于 20 米时不返回 */
  segmentDistance: number;
  /** 此段经过的站点数 */
  segmentStationCount: number;
  /** 此段耗时 */
  segmentTime: number;
}

/** uuid 为线路时返回的线路详细信息 */
export interface TransitLineInfo {
  /** 线路名称，如 "68路" */
  lineName: string;
  /** 线路类型：1 公交、2 地铁、3 磁悬浮 */
  lineType: 1 | 2 | 3;
  /** 线路长度（米） */
  length: number;
  /** 站点数据 */
  station: TransitBusStation[];
  /** 线路详细坐标串，点之间空格隔开 */
  linePoint: string;
  /** 始发车时间 "hh:mm"（24 小时制） */
  startTime: string;
  /** 末班车时间 "hh:mm"（24 小时制） */
  endTime: string;
  /** 全程运营总时间（分钟） */
  totalTime: number;
  /** 站点总数量 */
  stationCount: number;
  /** 发车间隔（秒） */
  interval: number;
  /** 计费模式：0 单一、1 按距离、2 按站 */
  ticketcal: 0 | 1 | 2;
  /** 全程票价（分） */
  totalPrice: number;
  /** 起步票价（分） */
  startPrice: number;
  /** 递增距离票价（按千米） */
  increasedPrice: number;
  /** 车站递增票价（按站） */
  increasedStep: number;
  /** 是否支持月票：0 不支持、1 支持 */
  ismonTicket: 0 | 1;
  /** 是否双向行驶：0 单向、1 双向 */
  isBidirectional: 0 | 1;
  /** 是否人工售票：0 有人、1 无人 */
  isManual: 0 | 1;
  /** 状态：0 使用中、1 非使用中 */
  status: 0 | 1;
  /** 所属公交公司 */
  company: string;
}

/** uuid 为公交站时返回的站点信息 */
export interface TransitBusStation {
  /** 站点名称 */
  name: string;
  /** 站的 id 信息 */
  uuid: string;
  /** 途经线路信息 */
  linedata: TransitBusLineData[];
  /** 站点坐标 "x,y" */
  lonlat: string;
}

export interface TransitBusLineData {
  /** 线路名称 */
  name: string;
  /** 线路的 id */
  uuid: string;
}
