import {
  gridlineLayerDef,
  tileLayerDef,
  tileLayerTdtDef,
  tileLayerWmsDef,
} from "@tianditu/core";

import { makeLayerElement } from "./factory";

/**
 * 瓦片图层元素：定义（props/构造/sync/事件表）见 core defs，元素只承载
 * attribute 声明与生命周期桥接。url 为必填 attribute；bounds 用
 * "swLng,swLat;neLng,neLat" 形态；格网图层的样式对象用 JSON。
 */

export const TdtTileLayerElement = makeLayerElement(tileLayerDef);

export const TdtTileLayerWmsElement = makeLayerElement(tileLayerWmsDef);

export const TdtTileLayerTdtElement = makeLayerElement(tileLayerTdtDef);

export const TdtGridlineLayerElement = makeLayerElement(gridlineLayerDef);
