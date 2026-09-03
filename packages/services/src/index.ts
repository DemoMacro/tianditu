import { TianDiTuWeb } from "./web";

/**
 * 浏览器端服务客户端。SDK 脚本加载已移交 @tianditu/core 的 loadT，
 * 本包只负责天地图 REST 服务的请求封装。
 */
export class TianDiTu extends TianDiTuWeb {}

export function defineTianditu({ tk, baseURL }: { tk: string; baseURL?: string }) {
  return new TianDiTu(tk, baseURL);
}
