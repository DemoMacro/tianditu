/**
 * Map 类的官方事件与交互开关，清单以官方 Map 文档页为准。
 * 文档外的事件（如 dblclick/mousemove 等 SDK 内部事件）不进直发表，
 * 可经 map 会话的事件桥命令式挂接。
 */

export const MAP_EVENT_NAMES = [
  "click",
  "contextmenu",
  "mouseover",
  "movestart",
  "moveend",
  "zoomend",
  "removeoverlay",
  "removecontrol",
  "dragstart",
  "dragend",
  "layerremove",
  "resize",
  "touchstart",
  "touchend",
] as const;

export interface MapInteractionOptions {
  dragging?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  keyboard?: boolean;
  inertia?: boolean;
  continuousZoom?: boolean;
  pinchToZoom?: boolean;
  autoResize?: boolean;
}

/** 初始化时一次性应用交互开关；未配置的项保持 SDK 默认（启用） */
export function applyMapInteractions(map: T.Map, options: MapInteractionOptions): void {
  const apply = (value: boolean | undefined, on: () => void, off: () => void) => {
    if (value === undefined) {
      return;
    }
    value ? on() : off();
  };
  apply(
    options.dragging,
    () => map.enableDrag(),
    () => map.disableDrag(),
  );
  apply(
    options.scrollWheelZoom,
    () => map.enableScrollWheelZoom(),
    () => map.disableScrollWheelZoom(),
  );
  apply(
    options.doubleClickZoom,
    () => map.enableDoubleClickZoom(),
    () => map.disableDoubleClickZoom(),
  );
  apply(
    options.keyboard,
    () => map.enableKeyboard(),
    () => map.disableKeyboard(),
  );
  apply(
    options.inertia,
    () => map.enableInertia(),
    () => map.disableInertia(),
  );
  apply(
    options.continuousZoom,
    () => map.enableContinuousZoom(),
    () => map.disableContinuousZoom(),
  );
  apply(
    options.pinchToZoom,
    () => map.enablePinchToZoom(),
    () => map.disablePinchToZoom(),
  );
  apply(
    options.autoResize,
    () => map.enableAutoResize(),
    () => map.disableAutoResize(),
  );
}
