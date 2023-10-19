import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: ["src/index"],
  externals: ["vue", "@tianditu/wc", "@tianditu/wc/dist/loader"],
});
