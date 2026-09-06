import { compact } from "@tianditu/core";

import { controlPositionProp, defineControlComponent } from "../controls/defineControlComponent";

/** 标绘控件（SDK 类 Control.militarySymbols）：地图上加载标绘工具条 */
export const TdtControlPlotSymbols = defineControlComponent<{
  position?: T.ControlPosition;
}>({
  name: "TdtControlPlotSymbols",
  props: { ...controlPositionProp },
  create: (props) => new T.Control.militarySymbols(compact({ position: props.position })),
});
