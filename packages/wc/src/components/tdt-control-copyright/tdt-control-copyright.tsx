import { Component, Host, Prop, State, h } from "@stencil/core";
import { onload } from "../../utils/use";

@Component({
  tag: "tdt-control-copyright",
  shadow: true,
})
export class TdtControlCopyright {
  @Prop({ reflect: true }) position: T.ControlPosition = "topright";
  @Prop({ reflect: true }) content?: string;

  @State() control!: T.ControlCopyright;
  @State() map!: T.Map;

  connectedCallback() {
    onload(() => {
      this.map = globalThis.map;

      this.control = new T.Control.Copyright({
        position: this.position,
      });

      this.map.addControl(this.control);
    });
  }

  componentWillRender() {
    onload(() => {
      this.content &&
        this.control.addCopyright({
          id: new Date().getTime().toString(),
          content: this.content,
          bounds: this.map.getBounds(),
        });
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
