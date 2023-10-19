import { applyPolyfills, defineCustomElements } from "@tianditu/wc/dist/loader";
import { Plugin } from "vue";

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
