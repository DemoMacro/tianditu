import { Config } from "@stencil/core";

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
  ],
};
