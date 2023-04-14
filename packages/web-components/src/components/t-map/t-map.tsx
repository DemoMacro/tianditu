import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "t-map",
})
export class TMap {
  @Prop() tk: string | undefined;

  connectedCallback() {
    const script = document.createElement("script");
    script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=${this.tk}`;
    document.head.appendChild(script);
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
