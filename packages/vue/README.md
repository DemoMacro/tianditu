# @tianditu/vue

![npm version](https://img.shields.io/npm/v/@tianditu/vue)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/vue)
![npm license](https://img.shields.io/npm/l/@tianditu/vue)

> Vue 3 components for the tianditu map, powered by Demo Macro.

## Features

- 🗺️ **`<TdtMap>` Container** — props for center/zoom/interactions; the 14 official map events forwarded natively
- 📌 **Overlays** — Marker, Polyline, Polygon, Circle, Rectangle, Label, MarkerClusterer, CloudMarkerCollection, InfoWindow, and ContextMenu as declarative components; prop changes sync through official setters
- 🎛️ **Controls** — Zoom, Scale, Copyright, OverviewMap, and MapType
- 🖱️ **Mouse Tools** — PolylineTool, PolygonTool, CircleTool, RectangleTool, MarkTool, PaintBrushTool, and CoordinatePickup with a controlled `active` prop
- 🗂️ **Layers** — TileLayer, TileLayer.WMS, TileLayer.TDT, GridlineLayer, and LayerGroup
- 🚩 **Plot Symbols** — 22 plotting entity components, 23 drawing tools, and the plot symbols control
- 📞 **Service Composables** — `useLocalSearch`, `useGeocoder`, `useGeolocation`, `useDrivingRoute`, `useTransitRoute`, `useBusLineSearch`, `useDataSources`, `useAdministrativeDivision`, `useLocalCity` with callbacks turned into Promises
- 🛟 **Escape Hatch** — `useMap()` exposes the reactive map instance; every component exposes its SDK instance for imperative access

## Installation

```bash
# npm
$ npm install @tianditu/vue

# yarn
$ yarn add @tianditu/vue

# pnpm
$ pnpm add @tianditu/vue
```

## Quick Start

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

Component groups mirror the official documentation categories — map, overlays, controls, mouse tools, layers, plot symbols, and services. Props, events, and exposes per component are documented in the [documentation](https://github.com/DemoMacro/tianditu/tree/main/docs).

## Related Packages

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — framework-agnostic core (installed automatically)
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components adapter
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — typed REST service client

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
