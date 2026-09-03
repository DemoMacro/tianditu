import { defineOverlayComponent } from "../defineOverlayComponent";
import { toLngLatProp } from "./utils";

export interface LabelProps {
  text: string;
  lnglat: [number, number] | T.LngLat;
  /** 字体颜色 */
  fontColor?: string;
  /** 字体大小（像素） */
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
    fontColor: { type: String, default: undefined },
    fontSize: { type: Number, default: undefined },
    backgroundColor: { type: String, default: undefined },
    title: { type: String, default: undefined },
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout"] as const,
  create(props, { map }) {
    const label = new T.Label({
      text: props.text,
      position: toLngLatProp(props.lnglat),
    });
    map.addOverLay(label);
    if (props.fontColor) label.setFontColor(props.fontColor);
    if (props.fontSize) label.setFontSize(props.fontSize);
    if (props.backgroundColor) label.setBackgroundColor(props.backgroundColor);
    if (props.title) label.setTitle(props.title);
    return label;
  },
  sync: {
    text: (label, value) => label.setLabel(value),
    lnglat: (label, value) => label.setLngLat(toLngLatProp(value)),
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
