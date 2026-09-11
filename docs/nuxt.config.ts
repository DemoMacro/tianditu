export default defineNuxtConfig({
  extends: ["docus"],

  compatibilityDate: "2026-09-06",

  css: ["~/assets/css/main.css"],

  // docus 的高亮语言白名单不含 tsx，React 示例块会回退纯文本
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            "bash",
            "diff",
            "json",
            "js",
            "ts",
            "tsx",
            "html",
            "css",
            "vue",
            "shell",
            "mdc",
            "md",
            "yaml",
          ],
        },
      },
    },
  },

  // live 示例的可选默认密钥：为空时由用户在页面输入（localStorage 优先）
  runtimeConfig: {
    public: {
      tianditu: {
        key: "",
      },
    },
  },
});
