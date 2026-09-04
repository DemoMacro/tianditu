import { TianDiTuWeb } from "./web";

export type {
  AdministrativeParams,
  AdministrativeResult,
  AdministrativeData,
  AdministrativeDistrict,
  AdministrativeChild,
  AdministrativeCenter,
} from "./types/administrative";
export type { DrivePostStr, DriveResult } from "./types/drive";
export type {
  GeoCodingDs,
  GeoCodingResult,
  GeoCodingLocation,
  ReverseGeoCodingPostStr,
  ReverseGeoCodingResult,
  ReverseGeoCodingDetail,
  ReverseGeoCodingAddressComponent,
  ReverseGeoCodingPoint,
} from "./types/geocoder";
export type {
  SearchPostStr,
  SearchResult,
  SearchPoi,
  SearchStationData,
  SearchStatistics,
  SearchPriorityCity,
  SearchAdmin,
  SearchArea,
  SearchSuggest,
  SearchPrompt,
  SearchPromptAdmin,
  SearchLineData,
  SearchResultStatus,
} from "./types/search";
export type { StaticImageParams } from "./types/staticImage";
export type {
  TransitPostStr,
  TransitResult,
  TransitTypeResult,
  TransitLine,
  TransitSegment,
  TransitStation,
  TransitSegmentLine,
  TransitLineInfo,
  TransitBusStation,
  TransitBusLineData,
} from "./types/transit";

/**
 * 浏览器端服务客户端。SDK 脚本加载已移交 @tianditu/core 的 loadTdt，
 * 本包只负责天地图 REST 服务的请求封装。
 */
export class TianDiTu extends TianDiTuWeb {}

export function defineTianditu({ tk, baseURL }: { tk: string; baseURL?: string }) {
  return new TianDiTu(tk, baseURL);
}
