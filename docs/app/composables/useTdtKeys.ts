const KEY_STORAGE = "tdt:key";

// module 级共享：文档站各页的 live 示例读写同一份密钥状态
const key = ref("");
let hydrated = false;

/**
 * live 示例的密钥管理：地图与服务示例都在浏览器运行，共用浏览器端密钥（tk）。
 * 读取顺序为 localStorage > 环境默认值；SSR 阶段保持为空，由客户端水合。
 */
export function useTdtKeys() {
  const config = useRuntimeConfig();

  if (import.meta.client && !hydrated) {
    hydrated = true;
    key.value = localStorage.getItem(KEY_STORAGE) ?? config.public.tianditu.key ?? "";
  }

  const setKey = (value: string) => {
    key.value = value;
    if (import.meta.client) {
      value ? localStorage.setItem(KEY_STORAGE, value) : localStorage.removeItem(KEY_STORAGE);
    }
  };

  return { key, setKey };
}

/**
 * 密钥输入面板的表单态：draft 双向绑定输入框，save/clear 带统一的
 * 保存提示（DemoKeySettings 与 AppKeyManager 共用）。
 */
export function useTdtKeyDraft() {
  const { key, setKey } = useTdtKeys();
  const toast = useToast();
  const draft = ref("");

  watchEffect(() => {
    draft.value = key.value;
  });

  function save() {
    const value = draft.value.trim();
    setKey(value);
    toast.add({
      title: value ? "密钥已保存" : "密钥已清除",
      color: "success",
      icon: "i-lucide-check",
    });
  }

  function clear() {
    draft.value = "";
    setKey("");
  }

  return { key, draft, save, clear };
}
