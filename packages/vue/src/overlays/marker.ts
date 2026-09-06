import { compact, toLngLat } from "@tianditu/core";
import type { PropType } from "vue";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatProp } from "./utils";

export interface MarkerProps {
  lnglat: [number, number];
  /** 标注图标：官方 Icon 实例或 IconOptions（iconUrl/iconSize/iconAnchor） */
  icon?: T.Icon | T.IconOptions;
  draggable?: boolean;
  title?: string;
  zIndexOffset?: number;
  opacity?: number;
}

function toIcon(value: T.Icon | T.IconOptions): T.Icon {
  return value instanceof T.Icon ? value : new T.Icon(value);
}

export const TdtMarker = defineOverlayComponent<MarkerProps, T.Marker>({
  name: "TdtMarker",
  props: {
    lnglat: { type: Array, required: true },
    icon: { type: [Object] as unknown as PropType<T.Icon | T.IconOptions>, default: undefined },
    draggable: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    zIndexOffset: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
  },
  events: [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mouseover",
    "mouseout",
    "dragstart",
    "drag",
    "dragend",
    "remove",
  ] as const,
  // 挂载/卸载走 core 缺省编排：collector 存在时加入聚合，否则 addOverLay
  create: (props) =>
    new T.Marker(
      toLngLat(props.lnglat),
      compact({
        icon: props.icon && toIcon(props.icon),
        draggable: props.draggable,
        title: props.title,
        zIndexOffset: props.zIndexOffset,
        opacity: props.opacity,
      }),
    ),
  sync: {
    lnglat: (marker, value) => marker.setLngLat(toLngLatProp(value)),
    icon: (marker, value) => {
      if (value !== undefined) marker.setIcon(toIcon(value));
    },
    draggable: (marker, value) =>
      value === false ? marker.disableDragging() : marker.enableDragging(),
    opacity: (marker, value) => {
      if (value !== undefined) marker.setOpacity(value);
    },
    zIndexOffset: (marker, value) => {
      if (value !== undefined) marker.setZIndexOffset(value);
    },
  },
});
