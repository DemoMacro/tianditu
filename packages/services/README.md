# @tianditu/services

![npm version](https://img.shields.io/npm/v/@tianditu/services)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/services)
![npm license](https://img.shields.io/npm/l/@tianditu/services)

> Typed REST client for the tianditu services, powered by Demo Macro.

## Features

- 🔌 **Standalone** — pure request wrapper, decoupled from the map runtime; runs in Node and browsers
- 💪 **Fully Typed** — typed requests and responses for every endpoint (`SearchResult`, `DriveResult`, `TransitResult`, `GeoCodingResult`, `AdministrativeResult`, …)
- 🧭 **Complete Endpoints** — place search, driving/transit planning, geocoding, reverse geocoding, administrative divisions, and static images
- 🛟 **Status Semantics** — result status codes (`infocode`) exposed as-is with the official meanings

## Installation

```bash
# npm
$ npm install @tianditu/services

# yarn
$ yarn add @tianditu/services

# pnpm
$ pnpm add @tianditu/services
```

## Quick Start

```typescript
import { defineTianditu } from "@tianditu/services";

const tianditu = defineTianditu({
  tk: "你的服务器端密钥",
});

const result = await tianditu.search({
  keyWord: "北京站",
  // 地名搜索V2.0：普通搜索（含地铁公交）
  queryType: 1,
  start: 0,
  count: 10,
});

if (result.status.infocode === 1000) {
  for (const poi of result.pois ?? []) {
    console.log(poi.name, poi.address, poi.lonlat);
  }
}
```

## API

| Method                      | Parameter                 | Description                   |
| --------------------------- | ------------------------- | ----------------------------- |
| `search(postStr)`           | `SearchPostStr`           | Place search V2.0             |
| `drive(postStr)`            | `DrivePostStr`            | Driving route planning        |
| `transit(postStr)`          | `TransitPostStr`          | Transit route planning        |
| `geoCoding(ds)`             | `GeoCodingDs`             | Geocoding                     |
| `reverseGeoCoding(postStr)` | `ReverseGeoCodingPostStr` | Reverse geocoding             |
| `administrative(params)`    | `AdministrativeParams`    | Administrative division query |
| `staticImage(params)`       | `StaticImageParams`       | Static map image              |

## Related Packages

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — framework-agnostic core
- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 component adapter
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components adapter

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
