import { Component, Host, Prop, State, h } from "@stencil/core";
import { onload } from "../../utils/use";

@Component({
  tag: "tdt-control-overview-map",
  shadow: true,
})
export class TdtControlOverviewMap {
  @Prop({ reflect: true }) position: T.ControlPosition = "bottomright";
  @Prop({ reflect: true }) isOpen: T.ControlOverviewMapOptions["isOpen"] = true;
  @Prop({ reflect: true }) uniqueId!: string;

  @State() control!: T.ControlOverviewMap;
  @State() map!: T.Map;

  connectedCallback() {
    onload(() => {
      this.map = globalThis[this.uniqueId];

      this.control = new T.Control.OverviewMap({
        isOpen: this.isOpen,
      });

      this.map.addControl(this.control);
    });
  }

  componentWillRender() {
    onload(() => {});
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
