import { compact } from "../compact";
import { parseBounds, parseSize } from "./converters";
import type { ControlDef } from "./types";

/**
 * 控件定义。逐个从 vue 适配层迁移：props 形状与 SDK 构造是 vue/wc 共同的
 * 唯一来源。ControlDef 无 sync——官方控件构造后位置由 setPosition 等命令式
 * 方法维护，声明式仅覆盖构造参数；Scale 的 color 走 setColor，只能在
 * create 内一并应用。
 */

export interface ControlZoomProps {
  position?: T.ControlPosition;
  zoomInText?: string;
  zoomOutText?: string;
  zoomInTitle?: string;
  zoomOutTitle?: string;
}

export const zoomDef: ControlDef<ControlZoomProps> = {
  name: "TdtControlZoom",
  tag: "tdt-control-zoom",
  props: {
    position: { type: String, default: undefined, attribute: "position" },
    zoomInText: { type: String, default: undefined, attribute: "zoom-in-text" },
    zoomOutText: { type: String, default: undefined, attribute: "zoom-out-text" },
    zoomInTitle: { type: String, default: undefined, attribute: "zoom-in-title" },
    zoomOutTitle: { type: String, default: undefined, attribute: "zoom-out-title" },
  },
  create: (props) =>
    new T.Control.Zoom(
      compact({
        position: props.position,
        zoomInText: props.zoomInText,
        zoomOutText: props.zoomOutText,
        zoomInTitle: props.zoomInTitle,
        zoomOutTitle: props.zoomOutTitle,
      }),
    ),
};

export interface ControlScaleProps {
  position?: T.ControlPosition;
  /** 比例尺颜色（官方 Control.Scale 方法 setColor） */
  color?: string;
}

export const scaleDef: ControlDef<ControlScaleProps> = {
  name: "TdtControlScale",
  tag: "tdt-control-scale",
  props: {
    position: { type: String, default: undefined, attribute: "position" },
    color: { type: String, default: undefined, attribute: "color" },
  },
  create: (props) => {
    const control = new T.Control.Scale(compact({ position: props.position }));
    if (props.color !== undefined) {
      control.setColor(props.color);
    }
    return control;
  },
};

export interface ControlCopyrightProps {
  position?: T.ControlPosition;
  /** 版权信息的唯一标识 */
  id?: string;
  /** 版权文本，支持 HTML */
  content?: string;
  /** 该版权信息适用的地理范围（官方 CopyrightOptions.bounds） */
  bounds?: [[number, number], [number, number]] | T.LngLatBounds;
}

function toBounds(value: ControlCopyrightProps["bounds"]): T.LngLatBounds | undefined {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}

export const copyrightDef: ControlDef<ControlCopyrightProps> = {
  name: "TdtControlCopyright",
  tag: "tdt-control-copyright",
  props: {
    position: { type: String, default: undefined, attribute: "position" },
    id: { type: String, default: undefined, attribute: "id" },
    content: { type: String, default: undefined, attribute: "content" },
    bounds: { type: Array, default: undefined, attribute: "bounds", converter: parseBounds },
  },
  create: (props) =>
    new T.Control.Copyright(
      compact({
        position: props.position,
        id: props.id,
        content: props.content,
        bounds: toBounds(props.bounds),
      }),
    ),
};

export interface ControlOverviewMapProps {
  position?: T.ControlPosition;
  /** 鹰眼控件大小 [width, height] */
  size?: [number, number];
  /** 添加到地图后的开合状态 */
  isOpen?: boolean;
}

export const overviewMapDef: ControlDef<ControlOverviewMapProps> = {
  name: "TdtControlOverviewMap",
  tag: "tdt-control-overview-map",
  props: {
    position: { type: String, default: undefined, attribute: "position" },
    size: { type: Array, default: undefined, attribute: "size", converter: parseSize },
    // Boolean 用 presence 语义：attribute 存在即 true
    isOpen: { type: Boolean, default: undefined, attribute: "is-open" },
  },
  create: (props) =>
    new T.Control.OverviewMap(
      compact({
        // 官方 OverviewMapOptions 的位置字段名为 anchor
        anchor: props.position,
        size: props.size ? new T.Point(props.size[0], props.size[1]) : undefined,
        isOpen: props.isOpen,
      }),
    ),
};

export interface ControlMapTypeProps {
  position?: T.ControlPosition;
  /** 控件展示的地图类型，默认为 SDK 默认列表 */
  mapTypes?: T.ControlMapTypeOptionsMapType[];
}

export const mapTypeDef: ControlDef<ControlMapTypeProps> = {
  name: "TdtControlMapType",
  tag: "tdt-control-map-type",
  props: {
    position: { type: String, default: undefined, attribute: "position" },
    // mapTypes 携带 SDK MapType 实例，不可序列化，仅 JS-only property
    mapTypes: { type: Array, default: undefined },
  },
  create: (props) =>
    new T.Control.MapType(
      compact({
        position: props.position,
        mapTypes: props.mapTypes,
      }),
    ),
};
