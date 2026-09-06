---
prose: true
seo:
  title: 天地图工具库
  description: 天地图 JavaScript API 与 REST 服务的类型化封装，提供 Vue 3 组件、Web Components 与服务客户端。
---

::u-page-hero
---
orientation: horizontal
---
:::DemoMap
:::
#title
把天地图装进你的项目
#description
天地图 JavaScript API 与 REST 服务的类型化封装。地图可以写成 Vue 3 组件，也可以写成原生 Web Components；搜索、路线规划等服务通过客户端函数调用。在右侧输入密钥，地图即可运行。
#links
:::u-button
---
label: 快速开始
size: lg
to: /getting-started/installation
trailingIcon: i-lucide-arrow-right
---
:::
:::u-button
---
label: GitHub
icon: i-simple-icons-github
size: lg
target: _blank
to: https://github.com/DemoMacro/tianditu
variant: outline
---
:::
::

::u-page-section
---
features:
  - icon: i-lucide-map
    title: 地图是一个组件
    description: "`<TdtMap>` 完成加载 SDK、初始化地图、桥接事件；覆盖物和控件作为子组件写入。"
  - icon: i-lucide-component
    title: 与官方 API 一一对应
    description: 标注、折线、多边形、点聚合、鼠标工具、图层、标绘，官方 API 的每一类都有对应组件。
  - icon: i-lucide-plug
    title: REST 服务客户端
    description: "`defineTianditu()` 调用地名搜索、驾车路线、公交路线、地理编码、行政区划等接口。"
  - icon: i-lucide-monitor-smartphone
    title: Vue 与 Web Components
    description: 同一套核心。Vue 项目用 `@tianditu/vue`，其他环境用 `@tianditu/web-components`。
  - icon: i-lucide-braces
    title: 完整类型定义
    description: props、事件、实例方法均有类型声明，参数错误在编译期报出。
  - icon: i-lucide-flask-conical
    title: 文档内嵌示例
    description: 各页面嵌有可运行的地图和服务示例，输入密钥即可试用。
---
::

::u-page-section
---
orientation: horizontal
---
:::code-group
```vue [Vue 3]
<script setup>
import { TdtMap, TdtMarker } from "@tianditu/vue";
</script>

<template>
  <TdtMap tk="你的浏览器端密钥" :center="[116.404, 39.915]" :zoom="12">
    <TdtMarker :lnglat="[116.404, 39.915]" />
  </TdtMap>
</template>
```
```html [Web Components]
<script type="module">
  import { registerComponents } from "@tianditu/web-components";

  registerComponents();
</script>

<tdt-map tk="你的浏览器端密钥" center="116.404,39.915" zoom="12">
  <tdt-marker lnglat="116.404,39.915"></tdt-marker>
</tdt-map>
```
```ts [REST 服务]
import { defineTianditu } from "@tianditu/services";

const tianditu = defineTianditu({ tk: "你的浏览器端密钥" });

const { pois } = await tianditu.search({ keyWord: "北京站" });
```
:::
#title
一张地图，[多种写法]{.text-(--ui-primary)}
#description
Vue 组件、原生自定义元素、独立服务客户端，共享同一个核心，按项目需要选用。
#links
:::u-button
---
color: neutral
label: 看第一个地图
to: /getting-started/first-map
trailingIcon: i-lucide-arrow-right
variant: subtle
---
:::
::

::u-page-section
#title
现在就开始
#description
本工具库是第三方封装，不是天地图官方产品；地图与服务的用法以天地图官方文档为准。
#links
:u-button{label="安装" to="/getting-started/installation" trailing-icon="i-lucide-arrow-right"}
::
