import * as tdtVue from "@tianditu/vue";

/**
 * 把 @tianditu/vue 的组件全局注册，让 MDC 文档内容可以
 * 直接书写 <TdtMarker> 等标签，由 MDCRenderer 的 resolveComponent 解析。
 */
export default defineNuxtPlugin((nuxtApp) => {
  for (const [name, component] of Object.entries(tdtVue)) {
    if (name.startsWith("Tdt")) {
      nuxtApp.vueApp.component(name, component as never);
    }
  }
});
