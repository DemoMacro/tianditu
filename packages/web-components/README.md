# @tianditu/web-components

![npm version](https://img.shields.io/npm/v/@tianditu/web-components)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/web-components)
![npm license](https://img.shields.io/npm/l/@tianditu/web-components)

> 用标准 Web Components 写天地图，任何框架或纯 HTML 均可使用。
> 基于 Lit 的自定义元素与 Vue 适配层共享同一份 core 定义：attribute 带类型化转换器，事件以 `tdt-` 前缀转发，覆盖物元素嵌套即挂载，容器元素就近收编子级。

## 特性

- 🖥️ **框架无关** — 标准自定义元素，任何框架或纯 HTML 均可使用
- 🧩 **基于 Lit** — 响应式 attribute，坐标与集合带类型化转换器
- 📦 **同源内核** — 与 Vue 适配层共享 @tianditu/core 的挂载/同步/卸载编排
- 🏷️ **声明式子级** — 覆盖物元素写在 `<tdt-map>` 内部即自动挂载

## 安装

```bash
# npm
$ npm install @tianditu/web-components

# yarn
$ yarn add @tianditu/web-components

# pnpm
$ pnpm add @tianditu/web-components
```

## 快速开始

```html
<script type="module">
  import { registerComponents } from "@tianditu/web-components";

  registerComponents();
</script>

<tdt-map tk="你的浏览器端密钥" center="116.404,39.915" zoom="12" style="width:100vw;height:100vh">
  <tdt-marker lnglat="116.404,39.915">
    <tdt-info-window open>
      <div>天安门</div>
    </tdt-info-window>
  </tdt-marker>
  <tdt-polyline path="116.38,39.9;116.42,39.92" color="#2563eb" weight="4"></tdt-polyline>
  <tdt-control-zoom position="bottomright"></tdt-control-zoom>
</tdt-map>
```

## 元素

| 元素              | 官方类         | 说明                                                                                                                                   |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `tdt-map`         | `T.Map`        | `tk`、`center`（"lng,lat"）、`locate`（定位方式："geolocation" / "ip" / "auto"，`locate` 空值即 auto）、`zoom`；事件以 `tdt-` 前缀派发 |
| `tdt-info-window` | `T.InfoWindow` | `open`、`lnglat`、`max-width` 等；嵌套在覆盖物内由宿主打开                                                                             |

### 覆盖物

| 元素                   | 官方类                    | 说明                                                                        |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `tdt-marker`           | `T.Marker`                | `lnglat`、`icon`（JSON）、`draggable`、`title`、`z-index-offset`、`opacity` |
| `tdt-polyline`         | `T.Polyline`              | `path`（"lng,lat;…"）、`color`、`weight`、`opacity`、`line-style`           |
| `tdt-polygon`          | `T.Polygon`               | 折线 attribute + `fill-color`、`fill-opacity`                               |
| `tdt-rectangle`        | `T.Rectangle`             | `bounds`（"swLng,swLat;neLng,neLat"）、线与填充 attribute                   |
| `tdt-circle`           | `T.Circle`                | `center`、`radius`、线与填充 attribute                                      |
| `tdt-label`            | `T.Label`                 | `text`、`lnglat`、`font-color`、`font-size`、`background-color`             |
| `tdt-cloud-marker`     | `T.CloudMarkerCollection` | `lnglats`（"lng,lat;…"）、`styles`（JSON）                                  |
| `tdt-marker-clusterer` | `T.MarkerClusterer`       | 收编子级标注；`grid-size`、`max-zoom`                                       |
| `tdt-layer-group`      | `T.LayerGroup`            | 收编子级覆盖物                                                              |

### 控件

`tdt-control-zoom`、`tdt-control-scale`、`tdt-control-copyright`、`tdt-control-overview-map`、`tdt-control-map-type` — attribute 随官方控件选项（`position`、`zoom-in-text`、`is-open` 等）。

### 图层

`tdt-tile-layer`、`tdt-tile-layer-wms`、`tdt-tile-layer-tdt`、`tdt-gridline-layer` — `url`（瓦片图层必填）、`opacity`、`z-index`、`bounds`；事件以 `tdt-` 前缀派发（`tdt-load`、`tdt-tileerror` 等）。

### 鼠标工具

`tdt-polyline-tool`、`tdt-polygon-tool`、`tdt-circle-tool`、`tdt-rectangle-tool`、`tdt-mark-tool`、`tdt-paint-brush-tool`、`tdt-coordinate-pickup` — 经布尔 `active` attribute 开关（presence 语义：框架绑定走 property，attribute 不存在即关闭）。

### 标绘

22 个标绘实体（`tdt-arc`、`tdt-bezier-curve2`、`tdt-bezier-curve3`、`tdt-bezier-curve-arrow`、`tdt-bezier-curve-n`、`tdt-cardinal-curve`、`tdt-cardinal-curve-arrow`、`tdt-parallel-search`、`tdt-polyline-arrow`、`tdt-sector-search`、`tdt-close-curve`、`tdt-curve-flag`、`tdt-diagonal-arrow`、`tdt-double-arrow`、`tdt-dove-tail-diagonal-arrow`、`tdt-dove-tail-straight-arrow`、`tdt-gathering-place`、`tdt-rect-flag`、`tdt-round-rect`、`tdt-sector`、`tdt-straight-arrow`、`tdt-triangle-flag`）共用 `path` attribute 与线、填充样式；23 个标绘工具（实体 tag 加 `-tool` 后缀，如 `tdt-arc-tool`、`tdt-hand-drawing-tool`）共用 `active` 开关、`style`（JSON）与 JS-only 的 `layers` property。

坐标类 attribute 用 `"lng,lat"` 逗号分隔；坐标集合用 `";"` 分隔；纯数据对象用 JSON。SDK 实例（图层组、地图类型等）为 JS-only property，无对应 attribute。

## 相关包

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — 框架无关内核（自动安装）
- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 组件适配层
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — 类型化 REST 服务客户端

## 许可

- [MIT](LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
