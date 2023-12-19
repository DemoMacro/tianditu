import { Component, Host, Prop, State, h } from "@stencil/core";
import { onload } from "../../utils/use";

@Component({
  tag: "tdt-control",
  shadow: true,
})
export class TdtControl {
  @Prop({ reflect: true }) control!: T.Control;
  @Prop({ reflect: true }) position?: T.ControlPosition;
  @Prop({ reflect: true }) visible = true;
  @Prop({ reflect: true }) offset?: T.Point;
  @Prop({ reflect: true }) options?: T.ControlOptions;

  @State() map!: T.Map;

  connectedCallback() {
    onload(() => {
      this.map = globalThis.map;

      if (!this.control) {
        this.control = new T.Control({
          position: this.position,
        });
      }

      this.map.addControl(this.control);
    });
  }

  componentWillRender() {
    onload(() => {
      this.position && this.control.setPosition(this.position);
      this.visible ? this.control.show() : this.control.hide();
      this.offset && this.control.setOffset(this.offset);
      this.options && this.control.setOptions(this.options);
    });
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
