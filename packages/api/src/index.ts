import { TianDiTuWeb } from "./web";

export class TianDiTu extends TianDiTuWeb {
  tk: string;
  baseURL: string = "http://api.tianditu.gov.cn";

  constructor(tk: string, baseURL?: string) {
    super(tk, baseURL);
  }
}

export function defineTianditu(tk: string) {
  return new TianDiTu(tk);
}
