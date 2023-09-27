# @tianditu/api

![npm version](https://img.shields.io/npm/v/@tianditu/api)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/api)
![npm license](https://img.shields.io/npm/l/@tianditu/api)

> Library for using the tianditu api, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @tianditu/api

# yarn
$ yarn add @tianditu/api

# pnpm
$ pnpm add @tianditu/api
```

## Usage

```typescript
import { defineTianditu } from "@tianditu/api";

const tianditu = defineTianditu({
  tk: "",
});

tianditu.apiLoadScript();
```

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
