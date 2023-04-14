import { Plugin } from "vue";
import {
  applyPolyfills,
  defineCustomElements,
} from "@tianditu/web-components/dist/loader";

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
