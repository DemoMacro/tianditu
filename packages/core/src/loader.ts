/**
 * 天地图 JS API 的幂等加载器。
 *
 * 加载流程：fetch 主脚本文本 → 预填组件包缓存 → 内联执行。预填的原因：
 * SDK 主脚本会并行加载组件包（localStorage 无缓存时经 XHR 乱序执行），
 * 而包间存在依赖（如 military.js 依赖 components.js 的 Tool），乱序时
 * 依赖包执行中断、包内类整体丢失；将组件包先按序写入 localStorage 后，
 * SDK 检查缓存命中即同步顺序执行，从源头规避竞态。预填失败或组件包
 * 仍缺失时（隐私模式、官方改版等），按哨兵检测补载兜底。
 *
 * SDK 挂载在全局 `window.T` 上且无卸载途径，以模块级 Promise 缓存保证
 * 并发调用共享同一次加载，失败时重置缓存以便重试。
 */

export interface LoadTdtOptions {
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

export function loadTdt(options: LoadTdtOptions): Promise<typeof T> {
  if (globalThis.T) {
    return Promise.resolve(globalThis.T);
  }
  if (pending) {
    return pending;
  }

  const version = options.version ?? DEFAULT_VERSION;
  const baseURL = options.baseURL ?? DEFAULT_BASE_URL;

  pending = (async () => {
    try {
      if (typeof document === "undefined") {
        throw new Error("[tianditu] loadTdt 只能在浏览器环境中调用");
      }
      const mainScript = await fetchText(
        `${baseURL}/api?v=${version}&tk=${options.tk}`,
        LOAD_TIMEOUT,
      );
      // 尽力预填组件包缓存；失败则由 SDK 原生路径加载，哨兵补载兜底
      try {
        await primeComponentCache(baseURL, mainScript);
      } catch {
        // 隐私模式 localStorage 不可用或单个包拉取失败，不阻断加载
      }
      runMainScript(mainScript);
      if (!globalThis.T) {
        throw new Error("[tianditu] SDK 脚本已执行但 window.T 不可用，请检查 tk 是否有效");
      }
      await repairComponentPacks(baseURL, version);
      return globalThis.T;
    } catch (error) {
      pending = undefined;
      throw error;
    }
  })();

  return pending;
}

function fetchText(url: string, timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`[tianditu] SDK 脚本加载超时：${url}`));
    }, timeout);
    fetch(url, { signal: controller.signal })
      .then((response) => {
        clearTimeout(timer);
        if (!response.ok) {
          throw new Error(`[tianditu] SDK 脚本加载失败（HTTP ${response.status}）：${url}`);
        }
        return response.text();
      })
      .then(resolve)
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

/** 从主脚本文本提取组件包清单（A:[...]）与缓存版本号（ZR:"..."） */
function parseComponentMeta(
  mainScript: string,
): { files: string[]; cacheVersion: string } | undefined {
  const files = mainScript.match(/A:(\["[^\]]*"\])/)?.[1];
  const cacheVersion = mainScript.match(/ZR:"([^"]+)"/)?.[1];
  if (!files || !cacheVersion) {
    return undefined;
  }
  try {
    return { files: JSON.parse(files) as string[], cacheVersion };
  } catch {
    return undefined;
  }
}

/**
 * 预填 SDK 组件包缓存：主脚本执行时按 `TDT_components{i}` 检查 localStorage，
 * 命中即同步顺序执行。这里并行拉取、按序写入，使首次访问也走命中路径。
 */
async function primeComponentCache(baseURL: string, mainScript: string): Promise<void> {
  const meta = parseComponentMeta(mainScript);
  if (!meta) {
    return;
  }
  // 版本号一次判定：循环内逐包重复读写 localStorage 是同步磁盘 I/O
  const versionMatched = localStorage.getItem("TDT_version") === meta.cacheVersion;
  await Promise.all(
    meta.files.map(async (file, index) => {
      const key = `TDT_components${index}`;
      if (versionMatched && localStorage.getItem(key)) {
        return;
      }
      const code = await fetchText(`${baseURL}${file}`, LOAD_TIMEOUT);
      localStorage.setItem(key, code);
    }),
  );
  // 全部就绪后才落版本号，避免半套缓存伪装成完整命中
  localStorage.setItem("TDT_version", meta.cacheVersion);
}

/** 内联执行主脚本（同步），保持全局作用域与官方 script 标签一致 */
function runMainScript(code: string): void {
  const script = document.createElement("script");
  script.text = code;
  document.head.appendChild(script);
  script.remove();
}

/**
 * SDK 组件包就绪哨兵：哨兵存在即该包执行完整。补载前先等 SDK 自身的
 * 加载波结束（键数稳定），避免与飞行中的包重复执行；补载重执行类定义
 * 为幂等覆写，且发生在任何用户实例构造之前，安全。
 */
const COMPONENT_PACKS = [
  { file: "components.js", ready: () => typeof T.PolylineTool === "function" },
  { file: "service.js", ready: () => typeof T.LocalSearch === "function" },
  { file: "military.js", ready: () => typeof T.Control?.militarySymbols === "function" },
] as const;

async function repairComponentPacks(baseURL: string, version: string): Promise<void> {
  if (COMPONENT_PACKS.every((pack) => pack.ready())) {
    return;
  }
  await waitModulesSettled();
  for (const pack of COMPONENT_PACKS) {
    if (pack.ready()) {
      continue;
    }
    await injectScript(`${baseURL}/v${version}/${pack.file}`);
  }
}

/** 重新注入组件包脚本，等待其执行完成 */
function injectScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      script.onload = script.onerror = null;
      reject(new Error(`[tianditu] 组件包加载超时：${url}`));
    }, LOAD_TIMEOUT);
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`[tianditu] 组件包加载失败：${url}`));
    };
    script.src = url;
    document.head.appendChild(script);
  });
}

/** 轮询到模块清单连续稳定即认为 SDK 自身加载波结束；限时兜底 */
function waitModulesSettled(timeout = 5_000): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now();
    let lastCount = Number.NaN;
    let stableRounds = 0;
    const poll = setInterval(() => {
      const count = Object.keys(globalThis.T ?? {}).length;
      stableRounds = count === lastCount ? stableRounds + 1 : 0;
      lastCount = count;
      if (stableRounds >= 5 || Date.now() - started > timeout) {
        clearInterval(poll);
        resolve();
      }
    }, 150);
  });
}

const NOT_READY_PATTERN = / is not a (?:constructor|function)$/;

/**
 * 构造就绪守卫：SDK 扩展类构造过早会抛 "is not a constructor"，此类
 * 时序错误按固定间隔重试直至成功；超时抛出最后一次的真实错误，其余
 * 错误立即抛出。
 */
export async function createWhenReady<T>(create: () => T, timeout = LOAD_TIMEOUT): Promise<T> {
  const started = Date.now();
  for (;;) {
    try {
      return create();
    } catch (error) {
      const retryable = error instanceof TypeError && NOT_READY_PATTERN.test(error.message.trim());
      if (!retryable || Date.now() - started > timeout) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
