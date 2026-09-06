# @tianditu/web-components

![npm version](https://img.shields.io/npm/v/@tianditu/web-components)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/web-components)
![npm license](https://img.shields.io/npm/l/@tianditu/web-components)

> Web Components for the tianditu map, powered by Demo Macro.

## Features

- 🖥️ **Framework-Free** — standard custom elements usable from any framework or plain HTML
- 🧩 **Lit-Based** — reactive attributes with typed converters for coordinates and collections
- 📦 **Same Core** — mount/sync/teardown orchestration shared with the Vue adapter via @tianditu/core
- 🏷️ **Declarative Children** — overlay elements nested inside `<tdt-map>` mount automatically

## Installation

```bash
# npm
$ npm install @tianditu/web-components

# yarn
$ yarn add @tianditu/web-components

# pnpm
$ pnpm add @tianditu/web-components
```

## Quick Start

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

## Elements

| Element             | Official class        | Notes                                                            |
| ------------------- | --------------------- | ---------------------------------------------------------------- |
| `tdt-map`           | Map                   | `tk`, `center` ("lng,lat"), `zoom`; events prefixed `tdt-`       |
| `tdt-marker`        | Marker                | `icon-url`, `draggable`, `title`, `z-index-offset`, `opacity`    |
| `tdt-polyline`      | Polyline              | `path` ("lng,lat;…"), `color`, `weight`, `opacity`, `line-style` |
| `tdt-circle`        | Circle                | `center`, `radius`, line and fill attributes                     |
| `tdt-cloud-marker`  | CloudMarkerCollection | `lnglats`, `shape`, `size`, `color`                              |
| `tdt-control-zoom`  | Control.Zoom          | `position`                                                       |
| `tdt-control-scale` | Control.Scale         | `position`                                                       |
| `tdt-info-window`   | InfoWindow            | `open`, `max-width`, `close-button`, `offset`, …                 |

Coordinate attributes use `"lng,lat"`; coordinate collections use `";"` separators.

## Related Packages

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — framework-agnostic core (installed automatically)
- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 component adapter
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — typed REST service client

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
