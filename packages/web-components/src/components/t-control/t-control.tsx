import { Component, Element, Host, h } from "@stencil/core";

@Component({
  tag: "t-control",
  shadow: true,
})
export class TControl {
  @Element() el!: HTMLTControlElement;

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
