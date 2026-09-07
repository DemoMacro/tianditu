# @tianditu/core

![npm version](https://img.shields.io/npm/v/@tianditu/core)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/core)
![npm license](https://img.shields.io/npm/l/@tianditu/core)

> 天地图 JavaScript API 的框架无关内核，不绑定任何 UI 框架。
> 幂等的 SDK 加载器与地图会话、覆盖物/工具/图层/信息窗的生命周期编排，以及驱动 Vue、React 与 Web Components 三个适配层的组件定义层都汇聚于此——适配层因此保持轻薄，接入新框架只需写响应式胶水。

## 特性

- 🔄 **幂等 SDK 加载器** — `loadTdt` 只拉取并执行一次官方脚本，预填组件包缓存规避加载竞态，并以哨兵检测补载缺失的包
- 🗺️ **地图会话** — `createMapSession` 按官方约定初始化地图并负责销毁；初始中心不传时回退北京，`locate` 支持三种定位方式：`"geolocation"` 浏览器定位、`"ip"` 官方 IP 定位、`"auto"` 前者优先浏览器失败回退 IP
- 🧩 **生命周期编排** — `mountOverlay`、`mountTool`、`mountTileLayer` 与 `createInfoWindow` 承担构造/挂载/同步/卸载，适配层保持轻薄
- 📑 **组件定义层** — `defs/` 下每组件一份框架无关定义（props 形状、SDK 构造、sync 与事件表），Vue、React 与 Web Components 适配层消费同一份
- 🔁 **Props 同步** — `createPropsSync` 把响应式 getter diff 成官方 setter 调用；`SyncDef` 声明 prop → setter 映射
- 📡 **事件桥** — `bindEventNames` 以统一的退订形状挂接/解绑 SDK 原生事件
- ⏳ **构造守卫** — `createWhenReady` 对 "is not a constructor" 时序错误重试，直至扩展组件包就绪
- 📑 **类型分发** — SDK 全局声明随包分发；import 本包即可在任意位置获得 `window.T` 类型

## 安装

```bash
# npm
$ npm install @tianditu/core

# yarn
$ yarn add @tianditu/core

# pnpm
$ pnpm add @tianditu/core
```

## 快速开始

```typescript
import { createMapSession, loadTdt } from "@tianditu/core";

const session = await createMapSession(container, {
  tk: "你的浏览器端密钥",
  center: [116.404, 39.915],
  zoom: 12,
});

session.destroy();
```

只加载 SDK 不建图时，也可使用导出的 `loadTdt({ tk })`。

## API

- **loader** — `loadTdt` / `createWhenReady`
- **session** — `createMapSession` / `toLngLat` / `toLngLats` / `DEFAULT_CENTER`
- **编排** — `mountOverlay` / `mountTool` / `mountTileLayer` / `createInfoWindow` / `applyMapInteractions`
- **定义层** — `OverlayDef` / `ToolDef` / `ControlDef` / `LayerDef` 与各组件 `xxxDef` 常量
- **工具** — `createPropsSync` / `bindEventNames` / `compact`

完整类型化 API 参考见[文档站](https://tianditu.demomacro.com/)。

## 相关包

- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 组件适配层
- [@tianditu/react](https://www.npmjs.com/package/@tianditu/react) — React 组件适配层
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components 适配层
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — 类型化 REST 服务客户端

## 许可

- [MIT](LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
