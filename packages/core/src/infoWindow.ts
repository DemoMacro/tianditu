import { bindEventNames } from "./events";
import { toLngLat } from "./session";

/**
 * 信息窗的纯 SDK 编排（对照官方 InfoWindow/Map/Marker 文档页）：
 * 打开是宿主方法（map.openInfoWindow(win, lnglat) / marker.openInfoWindow(win)），
 * 关闭是窗方法（closeInfoWindow）；内容容器为 DOM 时由本层创建，
 * 框架适配层可将其作为渲染目标。
 */

export interface InfoWindowSpec {
  /** 窗体内容：HTML 字符串或容器元素；缺省创建空 div 供适配层渲染 */
  content?: string | HTMLElement;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  autoPan?: boolean;
  closeButton?: boolean;
  offset?: T.Point;
}

export type InfoWindowHost = T.Map | T.Marker;

export interface InfoWindowHandle {
  readonly win: T.InfoWindow;
  /** content 为 DOM 时返回该容器，否则返回窗体内容容器 */
  readonly container: HTMLElement;
  /** 在宿主上打开；宿主为 Map 且未传坐标时取地图中心 */
  openOn(host: InfoWindowHost, lnglat?: T.LngLat | [number, number]): void;
  close(): void;
  isOpen(): boolean;
  /** 解绑事件；窗体本身由 SDK 管理 */
  destroy(): void;
}

const INFO_WINDOW_EVENT_NAMES = ["open", "close", "clickclose"] as const;

export function createInfoWindow(
  spec: InfoWindowSpec,
  dispatch: (name: (typeof INFO_WINDOW_EVENT_NAMES)[number], event: unknown) => void,
): InfoWindowHandle {
  const container =
    spec.content instanceof HTMLElement ? spec.content : document.createElement("div");
  const win = new T.InfoWindow(container, {
    minWidth: spec.minWidth,
    maxWidth: spec.maxWidth,
    maxHeight: spec.maxHeight,
    autoPan: spec.autoPan,
    closeButton: spec.closeButton,
    offset: spec.offset,
  });
  const unbind = bindEventNames(win, INFO_WINDOW_EVENT_NAMES, (name, event) =>
    dispatch(name as (typeof INFO_WINDOW_EVENT_NAMES)[number], event),
  );

  return {
    win,
    container,
    openOn(host, lnglat) {
      if (host instanceof T.Map) {
        host.openInfoWindow(win, lnglat ? toLngLat(lnglat) : host.getCenter());
      } else {
        host.openInfoWindow(win);
      }
    },
    close() {
      win.closeInfoWindow();
    },
    isOpen() {
      return win.isOpen();
    },
    destroy() {
      unbind();
    },
  };
}
