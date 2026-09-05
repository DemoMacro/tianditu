// 全局 SDK 类型声明（declare global { namespace T }）随包分发，import 即得
import type {} from "../types/index.d.ts";

export { EventBridge, bindEventNames, type EventTargetLike } from "./events";
export { compact } from "./compact";
export { createWhenReady, getTdt, isTdtLoaded, loadTdt, type LoadTdtOptions } from "./loader";
export { createAttachable, type Attachable, type AttachContext } from "./attach";
export {
  createMapSession,
  toLngLat,
  type CreateMapSessionOptions,
  type MapSession,
} from "./session";
export { createPropsSync, type SyncDef } from "./props-sync";
export { applyMapInteractions, MAP_EVENT_NAMES, type MapInteractionOptions } from "./map";
export {
  mountOverlay,
  type OverlayCollector,
  type OverlayHandle,
  type OverlayMountContext,
  type OverlayMountSpec,
} from "./overlay";
export {
  createInfoWindow,
  type InfoWindowHandle,
  type InfoWindowHost,
  type InfoWindowSpec,
} from "./infoWindow";
export { mountTool, type ToolLike, type ToolSession } from "./tools";
export { mountTileLayer, TILE_LAYER_EVENT_NAMES } from "./layer";
