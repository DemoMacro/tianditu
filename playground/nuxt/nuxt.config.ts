// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.includes("-"),
    },
  },
  build: {
    transpile: ["@tianditu/vue"],
  },
  runtimeConfig: {
    public: {
      tianditu: {
        serverKey: process.env.TIANDITU_SERVER_KEY,
        browserKey: process.env.TIANDITU_BROWSER_KEY,
      },
    },
  },
});
