import { Component, Host, Prop, State, h } from "@stencil/core";
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
  @Prop({ reflect: true }) uniqueId!: string;

  @State() control!: T.ControlZoom;
  @State() map!: T.Map;

  connectedCallback() {
    onload(() => {
      this.map = globalThis[this.uniqueId];

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
        <slot />
      </Host>
    );
  }
}
