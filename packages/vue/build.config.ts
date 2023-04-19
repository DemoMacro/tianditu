import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: ["src/index"],
  externals: [
    "vue",
    "@tianditu/web-components",
    "@tianditu/web-components/dist/loader",
  ],
});
