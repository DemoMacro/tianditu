import { compact } from "@tianditu/core";

import { controlPositionProp, defineControlComponent } from "./defineControlComponent";

export interface ControlZoomProps {
  position?: T.ControlPosition;
  zoomInText?: string;
  zoomOutText?: string;
  zoomInTitle?: string;
  zoomOutTitle?: string;
}

export const TdtControlZoom = defineControlComponent<ControlZoomProps>({
  name: "TdtControlZoom",
  props: {
    ...controlPositionProp,
    zoomInText: { type: String, default: undefined },
    zoomOutText: { type: String, default: undefined },
    zoomInTitle: { type: String, default: undefined },
    zoomOutTitle: { type: String, default: undefined },
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
});
