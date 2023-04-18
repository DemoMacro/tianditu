import { Component, Host, h, Prop, State } from "@stencil/core";
import { onload } from "../../utils/onload";

@Component({
  tag: "tdt-control-zoom",
  shadow: true,
})
export class TdtControlZoom {
  @Prop() position: T.ControlPosition = "topleft";
  @Prop() zoomInText!: string;
  @Prop() zoomInTitle!: string;
  @Prop() zoomOutText!: string;
  @Prop() zoomOutTitle!: string;

  @State() control!: T.Control;
  @State() map!: T.Map;

  componentWillLoad() {
    onload(() => {
      this.map = globalThis.map;
      this.control = new T.Control.Zoom();
      this.map.addControl(this.control);
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
