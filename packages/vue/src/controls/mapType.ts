import { defineControlComponent } from "./defineControlComponent";

/**
 * 地图类型切换控件。SDK 的 ControlMapTypeOptions 为数组类型且 position
 * 不在其中（types 包待核对），此处无参构造使用 SDK 默认类型列表。
 */
export const TdtControlMapType = defineControlComponent({
  name: "TdtControlMapType",
  props: {},
  create: () => new T.Control.MapType(),
});
