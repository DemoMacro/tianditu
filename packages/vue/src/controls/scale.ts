import { controlPositionProp, defineControlComponent } from "./defineControlComponent";

export interface ControlScaleProps {
  position?: T.ControlPosition;
  color?: string;
}

export const TdtControlScale = defineControlComponent<ControlScaleProps>({
  name: "TdtControlScale",
  props: {
    ...controlPositionProp,
    color: { type: String, default: undefined },
  },
  create: (props) => {
    const control = new T.Control.Scale({ position: props.position });
    if (props.color !== undefined) {
      control.setColor(props.color);
    }
    return control;
  },
});
