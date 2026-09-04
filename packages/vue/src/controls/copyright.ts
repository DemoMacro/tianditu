import { compact } from "@tianditu/core";

import { controlPositionProp, defineControlComponent } from "./defineControlComponent";

export interface ControlCopyrightProps {
  position?: T.ControlPosition;
  /** 版权信息的唯一标识 */
  id?: string;
  /** 版权文本，支持 HTML */
  content?: string;
}

export const TdtControlCopyright = defineControlComponent<ControlCopyrightProps>({
  name: "TdtControlCopyright",
  props: {
    ...controlPositionProp,
    id: { type: String, default: undefined },
    content: { type: String, default: undefined },
  },
  create: (props) =>
    new T.Control.Copyright(
      compact({
        position: props.position,
        id: props.id,
        content: props.content,
      }),
    ),
});
