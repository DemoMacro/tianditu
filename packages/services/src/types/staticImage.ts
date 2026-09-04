/**
 * 静态地图（官方文档 staticapi/static.html）。
 * 端点 /staticimage，返回 PNG 图片本体，可直接作为 <img src>。
 */

export interface StaticImageParams {
  /** 图片宽度（1-1024），默认 400 */
  width?: number;
  /** 图片高度（1-1024），默认 300 */
  height?: number;
  /** 地图中心点 "lng,lat" */
  center?: string;
  /** 地图级别（3-18），默认 10 */
  zoom?: number;
  /** 标注经纬度，多个以 "|" 隔开："lng,lat|lng,lat" */
  markers?: string;
  /** 标注样式，与 markers 一一对应，多个以 "|" 隔开 */
  markerStyles?: string;
  /** 折线，多条以 "|" 隔开，点间 ";"、坐标 ","："lng,lat;lng,lat|..." */
  paths?: string;
  /** 折线样式 "color,weight,opacity[,fillColor]"，多条以 "|" 隔开 */
  pathStyles?: string;
  /** 叠加图层类型组合，如 "vec_c,cva_c" */
  layers?: string;
  /** 传入经纬度时返回其相对图片左上角的屏幕坐标（优先于覆盖物参数） */
  pixLocation?: string;
}
