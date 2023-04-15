import { TianDiTuWeb } from "./web";

export class TianDiTu extends TianDiTuWeb {
  tk: string;
  baseURL: string = "https://api.tianditu.gov.cn";

  constructor(tk: string, baseURL?: string) {
    super(tk, baseURL);
  }

  public apiLoadScript(onload?: () => void) {
    if (!globalThis.T) {
      const script = globalThis.document.createElement("script");
      script.src = `${this.baseURL}/api?v=4.0&tk=${this.tk}`;
      script.async = true;
      script.defer = true;

      globalThis.document.head.appendChild(script);
      script.onload = () => {
        onload?.();
      };
    }
  }
}

export function defineTianditu(tk: string) {
  return new TianDiTu(tk);
}
