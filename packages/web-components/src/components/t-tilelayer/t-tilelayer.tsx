import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "t-tilelayer",
  shadow: true,
})
export class TTilelayer {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
