import { Component, Host, h, Prop, State } from "@stencil/core";
import { filterProps, onload } from "../../utils/use";

@Component({
  tag: "tdt-control-zoom",
  shadow: true,
})
export class TdtControlZoom {
  @Prop({ reflect: true }) position: T.ControlPosition = "topleft";
  @Prop({ reflect: true }) zoomInText?: T.ControlZoomOptions["zoomInText"];
  @Prop({ reflect: true }) zoomInTitle?: T.ControlZoomOptions["zoomInTitle"];
  @Prop({ reflect: true }) zoomOutText?: T.ControlZoomOptions["zoomOutText"];
  @Prop({ reflect: true }) zoomOutTitle?: T.ControlZoomOptions["zoomOutTitle"];

  @State() control!: T.ControlZoom;
  @State() map!: T.Map;

  connectedCallback() {
    onload(() => {
      this.map = globalThis.map;

      this.control = new T.Control.Zoom(
        filterProps({
          position: this.position,
          zoomInText: this.zoomInText,
          zoomInTitle: this.zoomInTitle,
          zoomOutText: this.zoomOutText,
          zoomOutTitle: this.zoomOutTitle,
        }),
      );
      this.map.addControl(this.control);
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
