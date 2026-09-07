// demo 运行所需的 Vite 环境约定（避免依赖 vite 包的 client 类型）
interface ImportMetaEnv {
  readonly VITE_TIANDITU_BROWSER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
