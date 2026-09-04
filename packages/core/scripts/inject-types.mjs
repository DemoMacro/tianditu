import { readFileSync, writeFileSync } from "node:fs";

// 全局 SDK 类型声明（declare global { namespace T }）以包根 types/ 目录
// 随包分发（见 package.json files）。dist/index.d.mts 头部 import
// types/global.d.mts 聚合模块，消费方 import 本包后即获得全局 T，
// 无需 tsconfig types 注入。
const IMPORT = 'import "../types/global.d.mts";\n';
const dts = "dist/index.d.mts";
const content = readFileSync(dts, "utf8");
if (!content.startsWith(IMPORT)) {
  writeFileSync(dts, IMPORT + content);
}
