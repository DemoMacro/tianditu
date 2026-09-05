import { createInfoWindow, createWhenReady, type InfoWindowHandle } from "@tianditu/core";
import { LitElement } from "lit";

import { lnglatConverter, type TdtMapElement } from "./tdt-map";

/**
 * 信息窗元素。内容为元素自身的子节点（light DOM），经 MutationObserver
 * 克隆进窗体容器：SDK 在 open 时会搬移内容容器，克隆可保持元素内原始
 * 子节点稳定，且避免 observer 被搬移触发误清窗口（vue 适配层同款方案）。
 * 独立使用时经 lnglat 属性由地图打开；嵌套在覆盖物元素内时由宿主打开。
 */
export class TdtInfoWindowElement extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    lnglat: { converter: lnglatConverter },
  };

  open = false;

  lnglat?: [number, number];

  private handle?: InfoWindowHandle;

  private observer?: MutationObserver;

  private map?: T.Map;

  override connectedCallback(): void {
    super.connectedCallback();
    this.style.display = "none";
    const container = this.closest("tdt-map") as TdtMapElement | null;
    if (!container) {
      return;
    }
    container
      .whenReady()
      .then((map) => {
        this.map = map;
        return createWhenReady(() =>
          createInfoWindow({}, (name) => {
            this.dispatchEvent(new CustomEvent(`tdt-${name}`, { detail: undefined }));
            if (name === "close") {
              this.open = false;
            }
          }),
        ).then((created) => {
          if (this.handle || !this.isConnected) {
            return;
          }
          this.handle = created;
          this.observer = new MutationObserver(() => this.syncContent());
          this.observer.observe(this, { childList: true, subtree: true, characterData: true });
          this.syncContent();
          this.syncOpen();
        });
      })
      .catch(() => {});
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.observer = undefined;
    this.handle?.destroy();
    this.handle = undefined;
  }

  /** 把元素子节点克隆进窗体容器 */
  private syncContent(): void {
    if (this.handle) {
      this.handle.container.replaceChildren(
        ...Array.from(this.childNodes, (node) => node.cloneNode(true)),
      );
    }
  }

  private syncOpen(): void {
    if (!this.handle || !this.map) {
      return;
    }
    if (this.open) {
      this.handle.openOn(
        this.map,
        this.lnglat ? new T.LngLat(this.lnglat[0], this.lnglat[1]) : undefined,
      );
    } else if (this.handle.isOpen()) {
      this.handle.close();
    }
  }

  protected override updated(): void {
    this.syncOpen();
  }
}
