import { compact, createWhenReady } from "@tianditu/core";
import { LitElement } from "lit";

import { type TdtMapElement } from "./tdt-map";

/**
 * 控件元素：attribute position → SDK 控件构造并 addControl，卸载时
 * removeControl。构造经 createWhenReady 守卫（SDK 扩展组件包异步加载）。
 */

abstract class ControlElement extends LitElement {
  position?: T.ControlPosition;

  private control?: T.Control;

  static override properties = {
    position: { type: String },
  };

  /** SDK 控件构造；扩展类构造前由 createWhenReady 守卫 */
  protected abstract create(position?: T.ControlPosition): T.Control;

  override connectedCallback(): void {
    super.connectedCallback();
    const container = this.closest("tdt-map") as TdtMapElement | null;
    if (!container) {
      return;
    }
    container
      .whenReady()
      .then((map) =>
        // 守卫等待期间元素可能已卸载，落定时不得再挂载
        createWhenReady(() => this.create(this.position)).then((control) => {
          if (this.control || !this.isConnected) {
            return;
          }
          this.control = control;
          map.addControl(control);
        }),
      )
      .catch(() => {});
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    const map = this.closest("tdt-map") as TdtMapElement | null;
    if (this.control && map) {
      void map
        .whenReady()
        .then((m) => m.removeControl(this.control!))
        .catch(() => {});
    }
    this.control = undefined;
  }
}

export class TdtControlZoomElement extends ControlElement {
  protected create(position?: T.ControlPosition): T.Control {
    return new T.Control.Zoom(compact({ position }));
  }
}

export class TdtControlScaleElement extends ControlElement {
  protected create(position?: T.ControlPosition): T.Control {
    return new T.Control.Scale(compact({ position }));
  }
}
