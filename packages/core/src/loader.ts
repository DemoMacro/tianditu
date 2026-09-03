/**
 * 天地图 JS API 的幂等加载器。
 *
 * 天地图 SDK 挂载在全局 `window.T` 上且无卸载途径，因此这里以模块级
 * Promise 缓存保证并发调用共享同一次加载，脚本加载失败时重置缓存以便重试。
 */

export interface LoadTOptions {
  /** 开发者密钥（tk） */
  tk: string;
  /** SDK 版本，默认 "4.0" */
  version?: string;
  /** SDK 地址前缀，默认官方地址 */
  baseURL?: string;
}

const DEFAULT_VERSION = "4.0";
const DEFAULT_BASE_URL = "https://api.tianditu.gov.cn";
const LOAD_TIMEOUT = 30_000;

let pending: Promise<typeof T> | undefined;

/** 读取已就绪的全局 T 对象，不触发加载 */
export function getT(): typeof T | undefined {
  return globalThis.T;
}

/** SDK 是否已加载完成 */
export function isTLoaded(): boolean {
  return Boolean(globalThis.T);
}

export function loadT(options: LoadTOptions): Promise<typeof T> {
  if (globalThis.T) {
    return Promise.resolve(globalThis.T);
  }
  if (pending) {
    return pending;
  }

  pending = new Promise<typeof T>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("[tianditu] loadT 只能在浏览器环境中调用"));
      return;
    }

    const version = options.version ?? DEFAULT_VERSION;
    const baseURL = options.baseURL ?? DEFAULT_BASE_URL;
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      pending = undefined;
      reject(new Error(`[tianditu] 天地图 SDK 加载超时（v${version}）`));
    }, LOAD_TIMEOUT);

    script.src = `${baseURL}/api?v=${version}&tk=${options.tk}`;
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      if (globalThis.T) {
        resolve(globalThis.T);
      } else {
        pending = undefined;
        reject(new Error("[tianditu] SDK 脚本已执行但 window.T 不可用，请检查 tk 是否有效"));
      }
    };
    script.onerror = () => {
      clearTimeout(timer);
      pending = undefined;
      reject(new Error(`[tianditu] SDK 脚本加载失败：${script.src}`));
    };
    document.body.appendChild(script);
  });

  return pending;
}
