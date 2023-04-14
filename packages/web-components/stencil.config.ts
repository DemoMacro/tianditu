import { Config } from "@stencil/core";
import { vueOutputTarget } from "@stencil/vue-output-target";

export const config: Config = {
  namespace: "web-components",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../dist/loader",
    },
    {
      type: "dist-custom-elements",
    },
    vueOutputTarget({
      componentCorePackage: "@tianditu/web-components",
      proxiesFile: "../vue/src/components.ts",
    }),
  ],
};
