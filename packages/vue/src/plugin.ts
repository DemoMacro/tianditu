import { defineCustomElements } from "@tianditu/wc/dist/loader";
import type { Plugin } from "vue";

export const ComponentLibrary: Plugin = {
  async install() {
    defineCustomElements();
  },
};
