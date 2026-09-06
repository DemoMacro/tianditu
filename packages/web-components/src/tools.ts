import { createWhenReady } from "@tianditu/core";
import {
  circleToolDef,
  markToolDef,
  paintBrushToolDef,
  polygonToolDef,
  polylineToolDef,
  rectangleToolDef,
} from "@tianditu/core";
import { LitElement, html, type PropertyValues } from "lit";

import { dispatchTdtEvent, findMap } from "./context";
import { makeToolElement } from "./factory";

/**
 * 鼠标工具元素：定义见 core defs；active attribute（presence 语义）受控
 * 开关。事件以 `tdt-<官方事件名>` 转发（如 tdt-draw）。
 */

export const TdtPolylineToolElement = makeToolElement(polylineToolDef);

export const TdtPolygonToolElement = makeToolElement(polygonToolDef);

export const TdtCircleToolElement = makeToolElement(circleToolDef);

export const TdtRectangleToolElement = makeToolElement(rectangleToolDef);

export const TdtMarkToolElement = makeToolElement(markToolDef);

export const TdtPaintBrushToolElement = makeToolElement(paintBrushToolDef);

/**
 * 坐标拾取元素（官方 CoordinatePickup）：非 Mousetool 体系，以
 * addEvent/removeEvent 开关；官方 Options.callback 转写为 tdt-pick 事件
 * （SDK 点击地图即调用 callback，未设置时点击会抛错，故构造必传）。
 */
export class TdtCoordinatePickupElement extends LitElement {
  static override properties = {
    active: { type: Boolean, reflect: true },
  };

  /** 受控开关：attribute 存在即开启 */
  active = false;

  private pickup?: T.CoordinatePickup;

  private callback = (lnglat: T.LngLat): void => {
    dispatchTdtEvent(this)("pick", lnglat);
  };

  override connectedCallback(): void {
    super.connectedCallback();
    const container = findMap(this);
    if (!container) {
      return;
    }
    void container
      .whenReady()
      .then((map) =>
        createWhenReady(() => new T.CoordinatePickup(map, { callback: this.callback })),
      )
      .then((created) => {
        if (this.pickup || !this.isConnected) {
          return;
        }
        this.pickup = created;
        if (this.active) {
          created.addEvent();
        }
      });
  }

  override updated(changed: PropertyValues): void {
    if (!changed.has("active") || !this.pickup) {
      return;
    }
    if (this.active) {
      this.pickup.addEvent();
    } else {
      this.pickup.removeEvent();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.pickup?.removeEvent();
    this.pickup = undefined;
  }

  override render() {
    return html``;
  }
}
