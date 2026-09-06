const BROWSER_KEY_STORAGE = "tdt:browser-key";
const SERVER_KEY_STORAGE = "tdt:server-key";

// module 级共享：文档站各页的 live 示例读写同一份密钥状态
const browserKey = ref("");
const serverKey = ref("");
let hydrated = false;

/**
 * live 示例的双密钥管理：浏览器端密钥（地图展示）与服务器端密钥（服务接口）。
 * 读取顺序为 localStorage > 环境默认值；SSR 阶段保持为空，由客户端水合。
 */
export function useTdtKeys() {
  const config = useRuntimeConfig();

  if (import.meta.client && !hydrated) {
    hydrated = true;
    browserKey.value =
      localStorage.getItem(BROWSER_KEY_STORAGE) ?? config.public.tianditu.browserKey ?? "";
    serverKey.value =
      localStorage.getItem(SERVER_KEY_STORAGE) ?? config.public.tianditu.serverKey ?? "";
  }

  const setBrowserKey = (value: string) => {
    browserKey.value = value;
    if (import.meta.client) {
      value
        ? localStorage.setItem(BROWSER_KEY_STORAGE, value)
        : localStorage.removeItem(BROWSER_KEY_STORAGE);
    }
  };

  const setServerKey = (value: string) => {
    serverKey.value = value;
    if (import.meta.client) {
      value
        ? localStorage.setItem(SERVER_KEY_STORAGE, value)
        : localStorage.removeItem(SERVER_KEY_STORAGE);
    }
  };

  return {
    browserKey,
    serverKey,
    setBrowserKey,
    setServerKey,
  };
}
