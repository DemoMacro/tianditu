import { type PropType } from "vue";

import { controlPositionProp, defineControlComponent } from "./defineControlComponent";

export interface ControlMapTypeProps {
  position?: T.ControlPosition;
  /** 控件展示的地图类型，缺省为 SDK 默认列表 */
  mapTypes?: T.ControlMapTypeOptionsMapType[];
}

export const TdtControlMapType = defineControlComponent<ControlMapTypeProps>({
  name: "TdtControlMapType",
  props: {
    ...controlPositionProp,
    mapTypes: {
      type: Array as unknown as PropType<T.ControlMapTypeOptionsMapType[]>,
      default: undefined,
    },
  },
  create: (props) =>
    new T.Control.MapType({
      position: props.position,
      mapTypes: props.mapTypes,
    }),
});
