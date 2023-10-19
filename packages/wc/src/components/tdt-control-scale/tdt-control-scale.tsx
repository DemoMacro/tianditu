import { Component, Host, Prop, State, h } from "@stencil/core";
import { onload } from "../../utils/use";

@Component({
  tag: "tdt-control-scale",
  shadow: true,
})
export class TdtControlScale {
  @Prop({ reflect: true }) position: T.ControlPosition = "bottomleft";
  @Prop({ reflect: true }) color?: string;

  @State() control!: T.ControlScale;
  @State() map!: T.Map;

  connectedCallback() {
    onload(() => {
      this.map = globalThis.map;

      this.control = new T.Control.Scale({
        position: this.position,
      });

      this.map.addControl(this.control);
    });
  }

  componentWillRender() {
    onload(() => {
      this.color && this.control.setColor(this.color);
    });
  }

  render() {
    return (
      <Host>
        <tdt-control control={this.control} position={this.position} />
      </Host>
    );
  }
}
