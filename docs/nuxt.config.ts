export default defineNuxtConfig({
  extends: ["docus"],

  compatibilityDate: "2026-09-06",

  css: ["~/assets/css/main.css"],

  // live 示例的可选默认密钥：为空时由用户在页面输入（localStorage 优先）
  runtimeConfig: {
    public: {
      tianditu: {
        browserKey: "",
        serverKey: "",
      },
    },
  },
});
