import { compact } from "@tianditu/core";

import { createTileLayerComponent } from "./tileLayer";

export interface GridlineLayerProps {
  /** 格网图层的网格大小，单位是像素，default: 256 */
  tileSize?: number;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
  /** 边线的颜色、宽度、线样式，default: {width:1, style:'solid', color:'#999'} */
  outlineSize?: T.GridlineLayerOptions["outlineSize"];
  /** 文字样式，图层文字表现网格的行号、列号、层级，default: {display:false, fontSize:'14', fontWeight:true, color:'black'} */
  textSize?: T.GridlineLayerOptions["textSize"];
}

/** 格网图层（官方 GridlineLayer）：官方仅列 loading/load 两个事件 */
export const TdtGridlineLayer = createTileLayerComponent<GridlineLayerProps>({
  name: "TdtGridlineLayer",
  props: {
    tileSize: { type: Number, default: undefined },
    minZoom: { type: Number, default: undefined },
    maxZoom: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    outlineSize: { type: Object, default: undefined },
    textSize: { type: Object, default: undefined },
  },
  events: ["loading", "load"] as const,
  // 官方选项无 url/zIndex，仅 opacity 有 setter（setOpacity）
  sync: {
    opacity: (layer, value) => layer.setOpacity(value ?? 1),
  },
  create: (props) =>
    new T.GridlineLayer(
      compact({
        tileSize: props.tileSize,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        outlineSize: props.outlineSize,
        textSize: props.textSize,
      }),
    ),
});
