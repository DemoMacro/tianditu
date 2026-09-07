# @tianditu/react

![npm version](https://img.shields.io/npm/v/@tianditu/react)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/react)
![npm license](https://img.shields.io/npm/l/@tianditu/react)

> 用 React 组件与 hooks 写天地图。
> 与 Vue 适配层共享同一份 core 定义：组件写在地图内部即自动挂载，props 变更经官方 setter 同步，官方事件以 `onXxx` 回调转发，每个组件都支持 ref 取 SDK 实例命令式兜底。

## 特性

- 🗺️ **`<TdtMap>` 容器** — center/zoom/交互等 props（`locate` 定位方式：`"geolocation"` 浏览器定位、`"ip"` 官方 IP 定位、`"auto"` 前者优先浏览器失败回退 IP，默认回退北京）；官方 14 个地图事件以 `onClick`、`onZoomEnd` 等回调转发
- 📌 **覆盖物** — Marker、Polyline、Polygon、Circle、Rectangle、Label、MarkerClusterer、CloudMarkerCollection、InfoWindow 与 ContextMenu 均为声明式组件；props 变化经官方 setter 同步
- 🎛️ **控件** — Zoom、Scale、Copyright、OverviewMap 与 MapType
- 🖱️ **鼠标工具** — PolylineTool、PolygonTool、CircleTool、RectangleTool、MarkTool、PaintBrushTool 与 CoordinatePickup，受控 `active` 开关
- 🗂️ **图层** — TileLayer、TileLayer.WMS、TileLayer.TDT、GridlineLayer 与 LayerGroup
- 🚩 **标绘** — 22 个标绘实体组件、23 个标绘工具与标绘控件
- 📞 **服务 hooks** — `useLocalSearch`、`useGeocoder`、`useGeolocation`、`useDrivingRoute`、`useTransitRoute`、`useBusLineSearch`、`useDataSources`、`useAdministrativeDivision`、`useLocalCity`，回调一律转为 Promise 或状态
- 🛟 **逃生口** — `useMap()` 提供响应式地图实例；每个组件都支持 ref 取其 SDK 实例，可命令式访问

## 安装

```bash
# npm
$ npm install @tianditu/react

# yarn
$ yarn add @tianditu/react

# pnpm
$ pnpm add @tianditu/react
```

## 快速开始

```tsx
import { useState } from "react";

import { TdtMap, TdtMarker, TdtInfoWindow } from "@tianditu/react";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <TdtMap
      tk="你的浏览器端密钥"
      center={[116.404, 39.915]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
    >
      <TdtMarker lnglat={[116.404, 39.915]}>
        <TdtInfoWindow open={open} onClose={() => setOpen(false)}>
          <div>天安门</div>
        </TdtInfoWindow>
      </TdtMarker>
    </TdtMap>
  );
}
```

## API

组件分组与官方文档类目一致——地图、覆盖物、控件、鼠标工具、图层、标绘与服务。每个组件的 props、事件回调与 ref 见[文档站](https://github.com/DemoMacro/tianditu/tree/main/docs)。

## 相关包

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — 框架无关内核（自动安装）
- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 组件适配层
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components 适配层
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — 类型化 REST 服务客户端

## 许可

- [MIT](LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
