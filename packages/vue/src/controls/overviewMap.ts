import { compact } from "@tianditu/core";
import { type PropType } from "vue";

import { controlPositionProp, defineControlComponent } from "./defineControlComponent";

export interface ControlOverviewMapProps {
  position?: T.ControlPosition;
  /** 鹰眼控件大小 [width, height] */
  size?: [number, number];
  /** 添加到地图后的开合状态 */
  isOpen?: boolean;
}

export const TdtControlOverviewMap = defineControlComponent<ControlOverviewMapProps>({
  name: "TdtControlOverviewMap",
  props: {
    ...controlPositionProp,
    size: {
      type: Array as unknown as PropType<[number, number]>,
      default: undefined,
    },
    isOpen: { type: Boolean, default: undefined },
  },
  create: (props) =>
    new T.Control.OverviewMap(
      compact({
        anchor: props.position,
        size: props.size ? new T.Point(props.size[0], props.size[1]) : undefined,
        isOpen: props.isOpen,
      }),
    ),
});
