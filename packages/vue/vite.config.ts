import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite-plus";

// demo（vp dev）直跑 core 源码热更新；pack 保持全外部化不受 alias 影响。
export default defineConfig(({ command }) => ({
  resolve:
    command === "serve"
      ? {
          alias: {
            "@tianditu/core": fileURLToPath(new URL("../core/src", import.meta.url)),
          },
        }
      : undefined,
  pack: {
    entry: ["src/index.ts"],
    deps: {
      neverBundle: true,
    },
  },
}));
