export default defineAppConfig({
  header: {
    title: "天地图工具库",
  },
  seo: {
    titleTemplate: "%s - 天地图工具库",
    title: "天地图工具库",
    description:
      "天地图 JavaScript API 的类型化封装——Vue 3 组件、React 组件、Web Components 与 REST 服务客户端，powered by Demo Macro",
  },
  github: {
    url: "https://github.com/DemoMacro/tianditu",
    branch: "main",
    rootDir: "docs",
  },
  navigation: { sub: "header" },
  ui: {
    colors: {
      primary: "sky",
    },
  },
  tdt: {
    // live 示例的默认视图：北京 天安门一带
    defaultCenter: [116.404, 39.915],
    defaultZoom: 12,
  },
});
