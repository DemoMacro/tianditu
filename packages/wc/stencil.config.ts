import { Config } from "@stencil/core";
import { vueOutputTarget } from "@stencil/vue-output-target";

export const config: Config = {
  namespace: "web-components",
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "dist-custom-elements",
    },
    {
      type: "dist-hydrate-script",
      dir: "dist/hydrate",
    },
    vueOutputTarget({
      componentCorePackage: "@tianditu/wc",
      proxiesFile: "../vue/src/components.ts",
    }),
    {
      type: "docs-json",
      file: "dist/docs.json",
    },
    {
      type: "docs-vscode",
      file: "dist/docs.code.json",
    },
  ],
};
