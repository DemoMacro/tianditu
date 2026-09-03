import { toLngLat } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatProp } from "./utils";

export interface MarkerProps {
  lnglat: [number, number];
  draggable?: boolean;
  title?: string;
  zIndexOffset?: number;
  opacity?: number;
}

export const TdtMarker = defineOverlayComponent<MarkerProps, T.Marker>({
  name: "TdtMarker",
  props: {
    lnglat: { type: Array, required: true },
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
  ] as const,
  create(props, context) {
    const marker = new T.Marker(toLngLat(props.lnglat), {
      draggable: props.draggable,
      title: props.title,
      zIndexOffset: props.zIndexOffset,
      opacity: props.opacity,
    });
    if (context.collector) {
      context.collector.addMarker(marker);
    } else {
      context.map.addOverLay(marker);
    }
    return marker;
  },
  destroy(marker, context) {
    if (context.collector) {
      context.collector.removeMarker(marker);
    } else {
      context.map.removeOverLay(marker);
    }
  },
  sync: {
    lnglat: (marker, value) => marker.setLngLat(toLngLatProp(value)),
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
