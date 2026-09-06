import { compact } from "@tianditu/core";
import type { PropType } from "vue";

import { controlPositionProp, defineControlComponent } from "./defineControlComponent";

export interface ControlCopyrightProps {
  position?: T.ControlPosition;
  /** 版权信息的唯一标识 */
  id?: string;
  /** 版权文本，支持 HTML */
  content?: string;
  /** 该版权信息适用的地理范围（官方 CopyrightOptions.bounds） */
  bounds?: [[number, number], [number, number]] | T.LngLatBounds;
}

function toBoundsProp(value: ControlCopyrightProps["bounds"]): T.LngLatBounds | undefined {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}

export const TdtControlCopyright = defineControlComponent<ControlCopyrightProps>({
  name: "TdtControlCopyright",
  props: {
    ...controlPositionProp,
    id: { type: String, default: undefined },
    content: { type: String, default: undefined },
    bounds: {
      type: Array as unknown as PropType<ControlCopyrightProps["bounds"]>,
      default: undefined,
    },
  },
  create: (props) =>
    new T.Control.Copyright(
      compact({
        position: props.position,
        id: props.id,
        content: props.content,
        bounds: toBoundsProp(props.bounds),
      }),
    ),
});
