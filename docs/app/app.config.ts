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
    prose: {
      codeIcon: {
        // Markup & data
        json: "i-vscode-icons-file-type-json",
        jsonc: "i-vscode-icons-file-type-json",
        html: "i-vscode-icons-file-type-html",
        htm: "i-vscode-icons-file-type-html",
        xml: "i-vscode-icons-file-type-xml",
        markdown: "i-vscode-icons-file-type-markdown",
        md: "i-vscode-icons-file-type-markdown",
        mdc: "i-vscode-icons-file-type-markdown",
        css: "i-vscode-icons-file-type-css",
        scss: "i-vscode-icons-file-type-css",
        less: "i-vscode-icons-file-type-css",
        yaml: "i-vscode-icons-file-type-yaml",
        yml: "i-vscode-icons-file-type-yaml",
        toml: "i-vscode-icons-file-type-toml",
        // JS / TS ecosystem
        js: "i-vscode-icons-file-type-js",
        javascript: "i-vscode-icons-file-type-js",
        mjs: "i-vscode-icons-file-type-js",
        cjs: "i-vscode-icons-file-type-js",
        jsx: "i-vscode-icons-file-type-js",
        ts: "i-vscode-icons-file-type-typescript",
        typescript: "i-vscode-icons-file-type-typescript",
        tsx: "i-vscode-icons-file-type-typescript",
        vue: "i-vscode-icons-file-type-vue",
        // Shell
        bash: "i-vscode-icons-file-type-shell",
        sh: "i-vscode-icons-file-type-shell",
        shell: "i-vscode-icons-file-type-shell",
        zsh: "i-vscode-icons-file-type-shell",
        batch: "i-vscode-icons-file-type-shell",
        // Plain text fallback
        text: "i-vscode-icons-file-type-text",
        plaintext: "i-vscode-icons-file-type-text",
      },
    },
  },
  tdt: {
    // live 示例的默认视图：北京 天安门一带
    defaultCenter: [116.404, 39.915],
    defaultZoom: 12,
  },
});
