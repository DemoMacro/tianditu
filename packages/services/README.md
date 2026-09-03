# @tianditu/services

![npm version](https://img.shields.io/npm/v/@tianditu/services)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/services)
![npm license](https://img.shields.io/npm/l/@tianditu/services)

> Library for using the tianditu api, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @tianditu/services

# yarn
$ yarn add @tianditu/services

# pnpm
$ pnpm add @tianditu/services
```

## Usage

```typescript
import { defineTianditu } from "@tianditu/services";

const tianditu = defineTianditu({
  tk: "",
});

tianditu.apiLoadScript();
```

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
