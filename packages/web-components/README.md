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

| Element           | Official class | Notes                                                     |
| ----------------- | -------------- | --------------------------------------------------------- |
| `tdt-map`         | `T.Map`        | `tk`, `center` ("lng,lat"), `zoom`; events prefixed `tdt-` |
| `tdt-info-window` | `T.InfoWindow` | `open`, `lnglat`, `max-width`, …; opens on the host overlay when nested |

### Overlays

| Element                | Official class           | Notes                                                                        |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `tdt-marker`           | `T.Marker`               | `lnglat`, `icon` (JSON), `draggable`, `title`, `z-index-offset`, `opacity`   |
| `tdt-polyline`         | `T.Polyline`             | `path` ("lng,lat;…"), `color`, `weight`, `opacity`, `line-style`             |
| `tdt-polygon`          | `T.Polygon`              | polyline attributes + `fill-color`, `fill-opacity`                           |
| `tdt-rectangle`        | `T.Rectangle`            | `bounds` ("swLng,swLat;neLng,neLat"), line and fill attributes               |
| `tdt-circle`           | `T.Circle`               | `center`, `radius`, line and fill attributes                                 |
| `tdt-label`            | `T.Label`                | `text`, `lnglat`, `font-color`, `font-size`, `background-color`              |
| `tdt-cloud-marker`     | `T.CloudMarkerCollection` | `lnglats` ("lng,lat;…"), `styles` (JSON)                                    |
| `tdt-marker-clusterer` | `T.MarkerClusterer`      | collects nested markers; `grid-size`, `max-zoom`                             |
| `tdt-layer-group`      | `T.LayerGroup`           | collects nested overlays                                                     |

### Controls

`tdt-control-zoom`, `tdt-control-scale`, `tdt-control-copyright`, `tdt-control-overview-map`, `tdt-control-map-type` — attributes follow the official control options (`position`, `zoom-in-text`, `is-open`, …).

### Layers

`tdt-tile-layer`, `tdt-tile-layer-wms`, `tdt-tile-layer-tdt`, `tdt-gridline-layer` — `url` (required for tile layers), `opacity`, `z-index`, `bounds`; events prefixed `tdt-` (`tdt-load`, `tdt-tileerror`, …).

### Mouse tools

`tdt-polyline-tool`, `tdt-polygon-tool`, `tdt-circle-tool`, `tdt-rectangle-tool`, `tdt-mark-tool`, `tdt-paint-brush-tool`, `tdt-coordinate-pickup` — toggled via the boolean `active` attribute (presence semantics: set the property from frameworks, an absent attribute means off).

### Plot symbols

The 22 plot entities (`tdt-arc`, `tdt-bezier-curve2`, `tdt-bezier-curve3`, `tdt-bezier-curve-arrow`, `tdt-bezier-curve-n`, `tdt-cardinal-curve`, `tdt-cardinal-curve-arrow`, `tdt-parallel-search`, `tdt-polyline-arrow`, `tdt-sector-search`, `tdt-close-curve`, `tdt-curve-flag`, `tdt-diagonal-arrow`, `tdt-double-arrow`, `tdt-dove-tail-diagonal-arrow`, `tdt-dove-tail-straight-arrow`, `tdt-gathering-place`, `tdt-rect-flag`, `tdt-round-rect`, `tdt-sector`, `tdt-straight-arrow`, `tdt-triangle-flag`) share the `path` attribute plus line/fill styling, and the 23 plot tools (the entity tags plus `-tool`, e.g. `tdt-arc-tool`, `tdt-hand-drawing-tool`) share the `active` toggle, `style` (JSON) and a JS-only `layers` property.

Coordinate attributes use `"lng,lat"`; coordinate collections use `";"` separators; pure-data objects use JSON. SDK instances (layer groups, map types) are JS-only properties without an attribute.

## Related Packages

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — framework-agnostic core (installed automatically)
- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 component adapter
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — typed REST service client

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
