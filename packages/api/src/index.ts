import { TianDiTuWeb } from "./web";

export class TianDiTu extends TianDiTuWeb {
  v = "4.0";
  tk = "";
  baseURL = "https://api.tianditu.gov.cn";

  constructor({
    v,
    tk,
    baseURL,
  }: {
    v?: string;
    tk: string;
    baseURL?: string;
  }) {
    super(tk, baseURL);
    this.v = v || this.v;
  }

  public apiLoadScript(onload?: () => void) {
    if (!globalThis.T) {
      const script = globalThis.document.createElement("script");
      script.src = `${this.baseURL}/api?v=${this.v}&tk=${this.tk}`;
      script.async = true;
      script.defer = true;

      globalThis.document.body.appendChild(script);
      script.onload = () => {
        onload?.();
      };
    }
  }
}

export function defineTianditu({
  v,
  tk,
  baseURL,
}: {
  v?: string;
  tk: string;
  baseURL?: string;
}) {
  return new TianDiTu({
    v,
    tk,
    baseURL,
  });
}
