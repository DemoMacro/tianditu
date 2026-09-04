/**
 * 驾车规划（官方文档 server/drive.html）。
 * 端点 /drive?type=search，postStr 为 JSON 串。
 */

export interface DrivePostStr {
  /** 起点经纬度 "lng,lat" */
  orig: string;
  /** 终点经纬度 "lng,lat" */
  dest: string;
  /** 途经点 "lng,lat;lng,lat" */
  mid?: string;
  /** 导航路线类型：0 最快、1 最短、2 避开高速、3 步行（默认 0） */
  style?: "0" | "1" | "2" | "3";
}

/**
 * 驾车规划响应。官方文档页的响应示例容器已失效（codeDemo 404），
 * 无响应结构文档，故不臆造类型；待真实环境取样后补充。
 */
export type DriveResult = Record<string, unknown>;
