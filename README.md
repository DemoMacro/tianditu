# tianditu

![GitHub](https://img.shields.io/github/license/DemoMacro/tianditu)

> Utility libraries for tianditu, powered by Demo Macro.

## Features

- 🗺️ **Component Coverage** — Components for every class of the official JavaScript API: map, overlays, controls, mouse tools, layers, and service classes
- 🖥️ **Two Runtimes** — The same capabilities as Vue 3 components (`@tianditu/vue`) or as Web Components (`@tianditu/web-components`)
- 🧭 **Framework-Agnostic Core** — SDK loader, map session, and lifecycle orchestration live in `@tianditu/core`, shared by every adapter
- 🔌 **Typed REST Client** — `@tianditu/services` wraps the REST endpoints with complete request/response types, independent of the map runtime
- 💪 **TypeScript-First** — Full type definitions distributed with every package; component props, events, and exposes are checked at compile time
- 📖 **Documentation Site** — Docus-based docs with live examples; enter your own key in the browser to try the map and services

## Packages

| Package                                                         | Description                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [@tianditu/core](./packages/core/README.md)                     | Framework-agnostic core: SDK loader, map session, lifecycle orchestration |
| [@tianditu/vue](./packages/vue/README.md)                       | Vue 3 component adapter                                                   |
| [@tianditu/web-components](./packages/web-components/README.md) | Web Components adapter                                                    |
| [@tianditu/services](./packages/services/README.md)             | Typed REST service client (decoupled from the map runtime)                |

## Quick Start

```bash
# Vue 3 components (includes @tianditu/core)
$ pnpm add @tianditu/vue

# Web Components (includes @tianditu/core)
$ pnpm add @tianditu/web-components

# REST service client (standalone)
$ pnpm add @tianditu/services
```

A map with Vue 3:

```vue
<script setup>
import { TdtMap, TdtMarker } from "@tianditu/vue";
</script>

<template>
  <TdtMap
    tk="你的浏览器端密钥"
    :center="[116.404, 39.915]"
    :zoom="12"
    style="width: 100%; height: 100%"
  >
    <TdtMarker :lnglat="[116.404, 39.915]" />
  </TdtMap>
</template>
```

The same map with Web Components:

```html
<script type="module">
  import { registerComponents } from "@tianditu/web-components";

  registerComponents();
</script>

<tdt-map
  tk="你的浏览器端密钥"
  center="116.404,39.915"
  zoom="12"
  style="width: 100vw; height: 100vh"
>
  <tdt-marker lnglat="116.404,39.915"></tdt-marker>
</tdt-map>
```

## Documentation

Guides, component API reference, and live examples live in [`docs/`](./docs/). Run the docs site locally:

```bash
$ pnpm docs:dev
```

## Development

```bash
$ git clone https://github.com/DemoMacro/tianditu.git
$ cd tianditu
$ pnpm install

$ pnpm build        # Build all packages
$ pnpm check        # Lint & format
$ pnpm docs:dev     # Docs site on :3000
```

## Contributing

Welcome contributions! Run `pnpm build && pnpm check` before opening a Pull Request against `main`.

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
