import { defineToolComponent } from "./defineToolComponent";

export interface MarkToolProps {
  /** 标注图标，缺省为 SDK 默认图标 */
  icon?: T.Icon;
  /** 标记图标是否跟随鼠标 */
  follow?: boolean;
}

export const TdtMarkTool = defineToolComponent<MarkToolProps>({
  name: "TdtMarkTool",
  props: {
    icon: { type: Object, default: undefined },
    follow: { type: Boolean, default: undefined },
  },
  events: ["mouseup"] as const,
  create: (props, map) =>
    new T.MarkTool(map, {
      icon: props.icon,
      follow: props.follow,
    }),
});
