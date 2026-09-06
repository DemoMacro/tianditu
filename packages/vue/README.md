# @tianditu/vue

![npm version](https://img.shields.io/npm/v/@tianditu/vue)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/vue)
![npm license](https://img.shields.io/npm/l/@tianditu/vue)

> 用 Vue 3 组件写天地图。
> 覆盖官方 JavaScript API 的地图、覆盖物、控件、鼠标工具、图层、标绘组件与服务组合式函数：组件写在地图内部即自动挂载，props 变更经官方 setter 同步，官方事件原生转发，每个组件都 expose SDK 实例可命令式兜底。

## 特性

- 🗺️ **`<TdtMap>` 容器** — center/zoom/交互等 props；官方 14 个地图事件原生转发
- 📌 **覆盖物** — Marker、Polyline、Polygon、Circle、Rectangle、Label、MarkerClusterer、CloudMarkerCollection、InfoWindow 与 ContextMenu 均为声明式组件；props 变化经官方 setter 同步
- 🎛️ **控件** — Zoom、Scale、Copyright、OverviewMap 与 MapType
- 🖱️ **鼠标工具** — PolylineTool、PolygonTool、CircleTool、RectangleTool、MarkTool、PaintBrushTool 与 CoordinatePickup，受控 `active` 开关
- 🗂️ **图层** — TileLayer、TileLayer.WMS、TileLayer.TDT、GridlineLayer 与 LayerGroup
- 🚩 **标绘** — 22 个标绘实体组件、23 个标绘工具与标绘控件
- 📞 **服务组合式** — `useLocalSearch`、`useGeocoder`、`useGeolocation`、`useDrivingRoute`、`useTransitRoute`、`useBusLineSearch`、`useDataSources`、`useAdministrativeDivision`、`useLocalCity`，回调一律转为 Promise
- 🛟 **逃生口** — `useMap()` 暴露响应式地图实例；每个组件都 expose 其 SDK 实例，可命令式访问

## 安装

```bash
# npm
$ npm install @tianditu/vue

# yarn
$ yarn add @tianditu/vue

# pnpm
$ pnpm add @tianditu/vue
```

## 快速开始

```vue
<script setup>
import { ref } from "vue";

import { TdtMap, TdtMarker, TdtInfoWindow } from "@tianditu/vue";

const open = ref(false);
</script>

<template>
  <TdtMap
    tk="你的浏览器端密钥"
    :center="[116.404, 39.915]"
    :zoom="12"
    style="width: 100%; height: 100%"
  >
    <TdtMarker :lnglat="[116.404, 39.915]" draggable>
      <TdtInfoWindow v-model:open="open">
        <div>天安门</div>
      </TdtInfoWindow>
    </TdtMarker>
  </TdtMap>
</template>
```

## API

组件分组与官方文档类目一致——地图、覆盖物、控件、鼠标工具、图层、标绘与服务。每个组件的 props、事件与 exposes 见[文档站](https://github.com/DemoMacro/tianditu/tree/main/docs)。

## 相关包

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — 框架无关内核（自动安装）
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components 适配层
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — 类型化 REST 服务客户端

## 许可

- [MIT](LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
