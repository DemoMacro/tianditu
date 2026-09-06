---
prose: true
seo:
  title: 天地图 工具库
  description: 天地图 JavaScript API 的类型化封装——Vue 3 组件、Web Components 与 REST 服务客户端，装上就能用。
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
官方 JavaScript API 与 REST 服务的类型化封装：地图可以写成 Vue 3 组件，也可以写成原生 Web Components；搜索、路线这些服务则交给一个客户端函数。输入密钥，右侧就是一张真地图。
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
    title: 一个容器全包了
    description: "`<TdtMap>` 负责加载 SDK、初始化地图、桥接事件；覆盖物、控件写进去就生效。"
  - icon: i-lucide-component
    title: 官方类逐一对应
    description: 标注、折线、多边形、点聚合、鼠标工具、图层、标绘，官方文档里每一类都有组件。
  - icon: i-lucide-plug
    title: 服务也能直接调
    description: "defineTianditu() 一个函数调通地名搜索、驾车公交路线、地理编码、行政区划等 REST 接口。"
  - icon: i-lucide-monitor-smartphone
    title: 两种写法随便挑
    description: 同一套能力，Vue 项目用 `@tianditu/vue`，其余任何环境用 `@tianditu/web-components`。
  - icon: i-lucide-braces
    title: 类型全带
    description: props、事件、实例方法都有类型定义，拼错一个参数编译期就报错。
  - icon: i-lucide-flask-conical
    title: 边读边试
    description: 文档页里嵌着真实地图和服务示例，输入你自己的密钥就能上手玩。
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

const tianditu = defineTianditu({ tk: "你的服务器端密钥" });

const { pois } = await tianditu.search({ keyWord: "北京站" });
```
:::
#title
一张地图，[三种写法]{.text-(--ui-primary)}任选
#description
Vue 组件、原生自定义元素、独立服务客户端——共享同一个核心，随项目形态搭配。
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
#links
:u-button{label="安装" to="/getting-started/installation" trailing-icon="i-lucide-arrow-right"}
::
