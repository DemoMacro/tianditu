import { ofetch, FetchRequest, FetchOptions } from "ofetch";

export class TianDiTuWeb {
  tk: string;
  baseURL: string = "https://api.tianditu.gov.cn";

  constructor(tk: string, baseURL?: string) {
    this.tk = tk;
    this.baseURL = baseURL || this.baseURL;
  }

  public apiFetch(request: FetchRequest, options?: FetchOptions) {
    const apiFetch = ofetch.create({
      baseURL: this.baseURL,
    });

    return apiFetch(request, options);
  }

  // http://lbs.tianditu.gov.cn/server/search.html
  public async search(postStr: {
    keyWord: string;
    mapBound: string;
    level: string;
    specifyAdminCode?: string;
    queryRadius?: string;
    pointLonlat?: string;
    queryType: string;
    start: string;
    count: string;
    lonlat?: string;
    bound?: string;
    zoom?: string;
    layers?: string;
    projection?: string;
  }) {
    return await this.apiFetch("/search", {
      params: {
        tk: this.tk,
        type: "query",
        postStr: postStr,
      },
    });
  }

  // http://lbs.tianditu.gov.cn/server/search2.html
  // public async search2(postStr) {}

  // http://lbs.tianditu.gov.cn/server/drive.html
  public async drive(postStr: {
    orig: string;
    dest: string;
    mid?: string;
    style?: "0" | "1" | "2" | "3";
  }) {
    return await this.apiFetch("/driving", {
      params: {
        tk: this.tk,
        type: "search",
        postStr: postStr,
      },
    });
  }

  // http://lbs.tianditu.gov.cn/server/bus.html
  public async busLine(postStr: {
    startPosition: string;
    endPosition: string;
    lineType: string;
  }) {
    return await this.apiFetch("/bus", {
      params: {
        tk: this.tk,
        type: "busline",
        postStr: postStr,
      },
    });
  }

  // http://lbs.tianditu.gov.cn/server/geocodinginterface.html
  public async geoCoding(ds: { keyWord: string }) {
    return await this.apiFetch("/geocoder", {
      params: {
        tk: this.tk,
        ds: ds,
      },
    });
  }

  // http://lbs.tianditu.gov.cn/server/geocoding.html
  public async reverseGeoCoding(postStr: {
    lon: number;
    lat: number;
    ver?: number;
  }) {
    return await this.apiFetch("/geocoder", {
      params: {
        tk: this.tk,
        type: "geocode",
        postStr: {
          lon: postStr.lon,
          lat: postStr.lat,
          ver: postStr.ver || 1,
        },
      },
    });
  }

  // http://lbs.tianditu.gov.cn/server/administrative.html
  public async administrative(postStr: {
    searchWord: string;
    searchType?: "0" | "1";
    needSubInfo?: boolean;
    needAllInfo?: boolean;
    needPolygon?: boolean;
    needPre?: boolean;
  }) {
    return await this.apiFetch("/administrative", {
      params: {
        tk: this.tk,
        postStr: postStr,
      },
    });
  }

  // http://lbs.tianditu.gov.cn/staticapi/static.html
  public async staticImage(params: {
    width?: number;
    height?: number;
    center?: string;
    zoom?: number;
    markers?: string;
    markerStyles?: string;
    paths?: string;
    pathStyles?: string;
    layers?: string;
    pixLocation?: string;
  }) {
    return await this.apiFetch("/staticimage", {
      params: {
        tk: this.tk,
        ...params,
      },
    });
  }
}
