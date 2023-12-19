import { Component, Element, Host, Prop, State, h } from "@stencil/core";

@Component({
  tag: "tdt-map",
  shadow: true,
})
export class TdtMap {
  @Element() el!: HTMLTdtMapElement;
  @Prop({ reflect: true }) tk!: string;
  @Prop({ reflect: true }) projection!: T.MapOptions["projection"];
  @Prop({ reflect: true }) minZoom!: T.MapOptions["minZoom"];
  @Prop({ reflect: true }) maxZoom!: T.MapOptions["maxZoom"];
  @Prop({ reflect: true }) maxBounds!: T.MapOptions["maxBounds"];
  @Prop({ reflect: true }) center: number[] = [0, 0];
  @Prop({ reflect: true }) zoom!: T.MapOptions["zoom"];

  @State() map!: T.Map;

  connectedCallback() {
    this.el.style.display = "block";
    this.el.style.height = "100%";
    this.el.style.width = "100%";

    globalThis.onload = () => {
      this.map = new T.Map(this.el, {
        projection: this.projection,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        maxBounds: this.maxBounds,
        center: new T.LngLat(this.center[0], this.center[1]),
        zoom: this.zoom,
      });

      this.map.centerAndZoom(
        new T.LngLat(this.center[0], this.center[1]),
        this.zoom || 18,
      );

      globalThis.map = this.map;
    };
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
