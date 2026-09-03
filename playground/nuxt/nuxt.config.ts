// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  build: {
    transpile: ["@tianditu/vue", "@tianditu/core"],
  },

  runtimeConfig: {
    public: {
      tianditu: {
        serverKey: process.env.TIANDITU_SERVER_KEY,
        browserKey: process.env.TIANDITU_BROWSER_KEY,
      },
    },
  },

  css: ["@unocss/reset/sanitize/sanitize.css", "@unocss/reset/sanitize/assets.css"],

  modules: ["@unocss/nuxt"],
  compatibilityDate: "2024-09-16",
});
