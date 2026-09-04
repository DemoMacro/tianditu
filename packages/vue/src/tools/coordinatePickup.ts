import { compact } from "@tianditu/core";

import { defineToolComponent } from "./defineToolComponent";

export interface CoordinatePickupProps {
  /** 坐标显示控件停靠位置 */
  anchor?: T.ControlPosition;
}

/** 坐标拾取组件：非 Mousetool 体系，以 addEvent/removeEvent 开关，无事件外发 */
export const TdtCoordinatePickup = defineToolComponent<CoordinatePickupProps>({
  name: "TdtCoordinatePickup",
  props: {
    anchor: { type: String, default: undefined },
  },
  create: (props, map) => new T.CoordinatePickup(map, compact({ anchor: props.anchor })),
  activate: (tool) => tool.addEvent?.(),
  deactivate: (tool) => tool.removeEvent?.(),
});
