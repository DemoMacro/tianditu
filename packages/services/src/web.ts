import { type FetchOptions, type FetchRequest, ofetch } from "ofetch";

import type { AdministrativeParams, AdministrativeResult } from "./types/administrative";
import type { DrivePostStr, DriveResult } from "./types/drive";
import type {
  GeoCodingDs,
  GeoCodingResult,
  ReverseGeoCodingPostStr,
  ReverseGeoCodingResult,
} from "./types/geocoder";
import type { SearchPostStr, SearchResult } from "./types/search";
import type { StaticImageParams } from "./types/staticImage";
import type {
  TransitLineInfo,
  TransitBusStation,
  TransitPostStr,
  TransitResult,
} from "./types/transit";

export class TianDiTu {
  tk: string;
  baseURL = "https://api.tianditu.gov.cn";

  private client: ReturnType<typeof ofetch.create>;

  constructor(tk: string, baseURL?: string) {
    this.tk = tk;
    this.baseURL = baseURL || this.baseURL;
    this.client = ofetch.create({ baseURL: this.baseURL });
  }

  public apiFetch<T>(request: FetchRequest, options?: FetchOptions<"json">): Promise<T> {
    return this.client<T>(request, options);
  }

  /** 地名搜索 V2.0（官方 server/search2.html） */
  public async search(postStr: SearchPostStr) {
    return await this.apiFetch<SearchResult>("/v2/search", {
      params: {
        tk: this.tk,
        type: "query",
        postStr: JSON.stringify(postStr),
      },
    });
  }

  /** 驾车规划（官方 server/drive.html） */
  public async drive(postStr: DrivePostStr) {
    return await this.apiFetch<DriveResult>("/drive", {
      params: {
        tk: this.tk,
        type: "search",
        postStr: JSON.stringify(postStr),
      },
    });
  }

  /** 公交规划 / 公交 uuid 详情查询 / 站点返程查询（官方 server/bus.html） */
  public async transit(postStr: TransitPostStr) {
    return await this.apiFetch<TransitResult | TransitLineInfo | TransitBusStation>("/transit", {
      params: {
        tk: this.tk,
        type: "busline",
        postStr: JSON.stringify(postStr),
      },
    });
  }

  /** 正向地理编码：地址转坐标（官方 server/geocodinginterface.html） */
  public async geoCoding(ds: GeoCodingDs) {
    return await this.apiFetch<GeoCodingResult>("/geocoder", {
      params: {
        tk: this.tk,
        ds: JSON.stringify(ds),
      },
    });
  }

  /** 逆地理编码：坐标转地址（官方 server/geocoding.html） */
  public async reverseGeoCoding(postStr: ReverseGeoCodingPostStr) {
    return await this.apiFetch<ReverseGeoCodingResult>("/geocoder", {
      params: {
        tk: this.tk,
        type: "geocode",
        postStr: JSON.stringify({ ver: 1, ...postStr }),
      },
    });
  }

  /** 行政区划 V2.0（官方 server/administrative2.html） */
  public async administrative(params: AdministrativeParams) {
    return await this.apiFetch<AdministrativeResult>("/v2/administrative", {
      params: {
        tk: this.tk,
        ...params,
      },
    });
  }

  /**
   * 静态地图 URL（官方 staticapi/static.html）：服务返回 PNG 图片本体，
   * 此处只构造 URL，直接用于 <img src>，不做请求。
   */
  public staticImage(params: StaticImageParams = {}) {
    const search = new URLSearchParams({
      tk: this.tk,
      ...Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined)),
    });
    return `${this.baseURL}/staticimage?${search}`;
  }
}
