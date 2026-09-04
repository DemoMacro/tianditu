import { controlPositionProp, defineControlComponent } from "../controls/defineControlComponent";

/** 标绘控件（官方 Control.militarySymbols）：地图上加载标绘工具条 */
export const TdtControlMilitarySymbols = defineControlComponent<{
  position?: T.ControlPosition;
}>({
  name: "TdtControlMilitarySymbols",
  props: { ...controlPositionProp },
  create: (props) => new T.ControlMilitarySymbols({ position: props.position }),
});
