import { ComponentLibrary } from "@tianditu/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ComponentLibrary);
});
