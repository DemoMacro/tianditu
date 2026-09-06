import { compact } from "@tianditu/core";
import type { PropType } from "vue";

import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatProp } from "./utils";

export interface LabelProps {
  text: string;
  lnglat: [number, number] | T.LngLat;
  /** 文本偏移（官方 LabelOptions.offset） */
  offset?: T.Point;
  /** 字体颜色（官方 Label 方法 setFontColor） */
  fontColor?: string;
  /** 字体大小（像素，官方 Label 方法 setFontSize） */
  fontSize?: number;
  backgroundColor?: string;
  /** 提示内容（title） */
  title?: string;
}

export const TdtLabel = defineOverlayComponent<LabelProps, T.Label>({
  name: "TdtLabel",
  props: {
    text: { type: String, required: true },
    lnglat: { type: Array, required: true },
    offset: { type: Object as unknown as PropType<T.Point>, default: undefined },
    fontColor: { type: String, default: undefined },
    fontSize: { type: Number, default: undefined },
    backgroundColor: { type: String, default: undefined },
    title: { type: String, default: undefined },
  },
  // 官方 Label 事件表：click/dblclick/mousedown/mouseout/mouseup
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseout"] as const,
  create(props) {
    const label = new T.Label(
      compact({
        text: props.text,
        position: toLngLatProp(props.lnglat),
        offset: props.offset,
      }),
    );
    if (props.fontColor) label.setFontColor(props.fontColor);
    if (props.fontSize) label.setFontSize(props.fontSize);
    if (props.backgroundColor) label.setBackgroundColor(props.backgroundColor);
    if (props.title) label.setTitle(props.title);
    return label;
  },
  sync: {
    text: (label, value) => label.setLabel(value),
    lnglat: (label, value) => label.setLngLat(toLngLatProp(value)),
    offset: (label, value) => {
      if (value !== undefined) label.setOffset(value);
    },
    fontColor: (label, value) => {
      if (value !== undefined) label.setFontColor(value);
    },
    fontSize: (label, value) => {
      if (value !== undefined) label.setFontSize(value);
    },
    backgroundColor: (label, value) => {
      if (value !== undefined) label.setBackgroundColor(value);
    },
    title: (label, value) => {
      if (value !== undefined) label.setTitle(value);
    },
  },
});
