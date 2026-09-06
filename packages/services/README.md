# @tianditu/services

![npm version](https://img.shields.io/npm/v/@tianditu/services)
![npm downloads](https://img.shields.io/npm/dw/@tianditu/services)
![npm license](https://img.shields.io/npm/l/@tianditu/services)

> 天地图 REST 服务的类型化客户端，Node 与浏览器均可运行。
> 覆盖地名搜索、驾车/公交规划、地理编码、逆地理编码、行政区划与静态地图：每个接口都有类型化的请求与响应，状态码语义与官方一致，与地图运行时解耦、可独立使用。

## 特性

- 🔌 **独立可用** — 纯请求封装，与地图运行时解耦；Node 与浏览器均可运行
- 💪 **完整类型** — 每个接口都有类型化请求与响应（`SearchResult`、`DriveResult`、`TransitResult`、`GeoCodingResult`、`AdministrativeResult` 等）
- 🧭 **接口齐全** — 地名搜索、驾车/公交规划、地理编码、逆地理编码、行政区划与静态地图
- 🛟 **状态语义** — 结果状态码（`infocode`）原样暴露，含义与官方一致

## 安装

```bash
# npm
$ npm install @tianditu/services

# yarn
$ yarn add @tianditu/services

# pnpm
$ pnpm add @tianditu/services
```

## 快速开始

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

| 方法                        | 参数                      | 说明             |
| --------------------------- | ------------------------- | ---------------- |
| `search(postStr)`           | `SearchPostStr`           | 地名搜索 V2.0    |
| `drive(postStr)`            | `DrivePostStr`            | 驾车路线规划     |
| `transit(postStr)`          | `TransitPostStr`          | 公交路线规划     |
| `geoCoding(ds)`             | `GeoCodingDs`             | 地理编码         |
| `reverseGeoCoding(postStr)` | `ReverseGeoCodingPostStr` | 逆地理编码       |
| `administrative(params)`    | `AdministrativeParams`    | 行政区划查询     |
| `staticImage(params)`       | `StaticImageParams`       | 静态地图         |

## 相关包

- [@tianditu/core](https://www.npmjs.com/package/@tianditu/core) — 框架无关内核
- [@tianditu/vue](https://www.npmjs.com/package/@tianditu/vue) — Vue 3 组件适配层
- [@tianditu/web-components](https://www.npmjs.com/package/@tianditu/web-components) — Web Components 适配层

## 许可

- [MIT](LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
