# @tianditu/core

![npm version](https://img.shields.io/npm/v/@tianditu/core)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/core)
![npm license](https://img.shields.io/npm/l/@tianditu/core)

> Framework-agnostic core for the tianditu libraries, powered by Demo Macro.

## Features

- 🔄 **Idempotent SDK Loader** — `loadTdt` fetches and executes the official script once, pre-fills the component-pack cache to avoid load races, and repairs missing packs with sentinel checks
- 🗺️ **Map Session** — `createMapSession` initializes the map per the official convention and owns teardown
- 🧩 **Lifecycle Orchestration** — `mountOverlay`, `mountTool`, `mountTileLayer`, and `createInfoWindow` handle construct/attach/sync/detach so adapters stay thin
- 🔁 **Props Sync** — `createPropsSync` diffs reactive getters against official setters; `SyncDef` maps prop → setter
- 📡 **Event Bridge** — `bindEventNames` attaches/detaches native SDK events with a uniform unsubscribe shape
- ⏳ **Construct Guard** — `createWhenReady` retries "is not a constructor" timing errors until extension packs are ready
- 📑 **Distributed Types** — global SDK declarations ship with the package; importing it types `window.T` everywhere

## Installation

```bash
# npm
$ npm install @tianditu/core

# yarn
$ yarn add @tianditu/core

# pnpm
$ pnpm add @tianditu/core
```

## Quick Start

```typescript
import { createMapSession, loadTdt } from "@tianditu/core";

const session = await createMapSession(container, {
  tk: "你的浏览器端密钥",
  center: [116.404, 39.915],
  zoom: 12,
});

session.destroy();
```

`loadTdt({ tk })` is also exported for loading the SDK without creating a map.

## API

- **loader** — `loadTdt` / `getTdt` / `isTdtLoaded` / `createWhenReady`
- **session** — `createMapSession` / `toLngLat`
- **orchestration** — `mountOverlay` / `mountTool` / `mountTileLayer` / `createInfoWindow` / `applyMapInteractions`
- **utilities** — `createPropsSync` / `bindEventNames` / `compact` / `createAttachable`

The full typed API reference lives in the [documentation](https://github.com/DemoMacro/tianditu/tree/main/docs).

## Related Packages

- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 component adapter
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components adapter
- [@tianditu/services](https://www.npmjs.com/package/@tianditu/services) — typed REST service client

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
