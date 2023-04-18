import { Component, Host, h, State, Prop } from "@stencil/core";
import { onload } from "../../utils/onload";

@Component({
  tag: "tdt-control",
  shadow: true,
})
export class TdtControl {
  @Prop() control!: T.Control;

  @State() map!: T.Map;

  componentWillLoad() {
    onload(() => {
      this.map = globalThis.map;
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
