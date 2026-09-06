import { compact, createInfoWindow, createWhenReady, type InfoWindowHandle } from "@tianditu/core";
import { LitElement } from "lit";

import { lnglatConverter, type TdtMapElement } from "./tdt-map";

/**
 * 信息窗元素。内容为元素自身的子节点（light DOM），经 MutationObserver
 * 克隆进窗体容器：SDK 在 open 时会搬移内容容器，克隆可保持元素内原始
 * 子节点稳定，且避免 observer 被搬移触发误清窗口（vue 适配层同款方案）。
 * 独立使用时经 lnglat 属性由地图打开；嵌套在覆盖物元素内时由宿主打开。
 * attribute 随官方 InfoWindowOptions 字段（kebab-case）。
 */

/** "x,y" 属性 → T.Point */
function pointConverter(value: string | null): T.Point | undefined {
  if (!value) {
    return undefined;
  }
  const [x, y] = value.split(",").map(Number);
  return new T.Point(x, y);
}

export class TdtInfoWindowElement extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    lnglat: { converter: lnglatConverter },
    minWidth: { type: Number, attribute: "min-width" },
    maxWidth: { type: Number, attribute: "max-width" },
    maxHeight: { type: Number, attribute: "max-height" },
    autoPan: { type: Boolean, attribute: "auto-pan" },
    closeButton: { type: Boolean, attribute: "close-button" },
    offset: { converter: pointConverter },
    autoPanPadding: { converter: pointConverter, attribute: "auto-pan-padding" },
    closeOnClick: { type: Boolean, attribute: "close-on-click" },
  };

  open = false;

  lnglat?: [number, number];

  minWidth?: number;

  maxWidth?: number;

  maxHeight?: number;

  autoPan?: boolean;

  closeButton?: boolean;

  offset?: T.Point;

  autoPanPadding?: T.Point;

  closeOnClick?: boolean;

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
          createInfoWindow(
            compact({
              minWidth: this.minWidth,
              maxWidth: this.maxWidth,
              maxHeight: this.maxHeight,
              autoPan: this.autoPan,
              closeButton: this.closeButton,
              offset: this.offset,
              autoPanPadding: this.autoPanPadding,
              closeOnClick: this.closeOnClick,
            }),
            (name) => {
              this.dispatchEvent(new CustomEvent(`tdt-${name}`, { detail: undefined }));
              if (name === "close") {
                this.open = false;
              }
            },
          ),
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
