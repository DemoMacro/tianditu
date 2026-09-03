import { createMapSession, toLngLat, type MapSession } from "@tianditu/core";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  type PropType,
} from "vue";

import { MAP_KEY, type MapContext } from "./context";

/**
 * 转发给 SDK 的地图事件名。采用原生事件名直发（@click / @zoomend ...），
 * 不建命名映射层，payload 为原生 T 事件对象。
 */
export const MAP_EVENT_NAMES = [
  "click",
  "dblclick",
  "contextmenu",
  "mousemove",
  "mouseover",
  "mouseout",
  "movestart",
  "move",
  "moveend",
  "zoomstart",
  "zoomend",
  "dragstart",
  "drag",
  "dragend",
  "load",
  "resize",
  "levels",
  "touchstart",
  "touchmove",
  "touchend",
  "longpress",
] as const;

export type TdtMapProps = {
  /** 开发者密钥，仅初始化时生效 */
  tk: string;
  /** 中心点 [lng, lat] */
  center?: [number, number];
  /** 缩放级别 */
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** 投影，仅初始化时生效 */
  projection?: string;
  /** 地图类型，如 window.TMAP_NORMAL_MAP */
  mapType?: T.MapType;
  /** 显示范围限制 */
  limitBounds?: T.LngLatBounds;
  dragging?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  keyboard?: boolean;
  inertia?: boolean;
  continuousZoom?: boolean;
  pinchToZoom?: boolean;
};

export const TdtMap = defineComponent({
  name: "TdtMap",
  props: {
    tk: { type: String as PropType<string>, required: true },
    center: {
      type: Array as unknown as PropType<NonNullable<TdtMapProps["center"]>>,
      default: () => [116.404, 39.915],
    },
    zoom: { type: Number, default: 12 },
    minZoom: { type: Number, default: undefined },
    maxZoom: { type: Number, default: undefined },
    projection: { type: String, default: undefined },
    mapType: {
      type: Object as PropType<T.MapType>,
      default: undefined,
    },
    limitBounds: {
      type: Object as PropType<T.LngLatBounds>,
      default: undefined,
    },
    dragging: { type: Boolean, default: true },
    scrollWheelZoom: { type: Boolean, default: true },
    doubleClickZoom: { type: Boolean, default: true },
    keyboard: { type: Boolean, default: true },
    inertia: { type: Boolean, default: true },
    continuousZoom: { type: Boolean, default: true },
    pinchToZoom: { type: Boolean, default: true },
  },
  emits: ["ready", ...MAP_EVENT_NAMES],
  setup(props, { emit, slots, expose }) {
    const el = ref<HTMLElement>();
    const map = shallowRef<T.Map>();
    const session = shallowRef<MapSession>();
    const ready = shallowRef(false);
    let stopWatchers: Array<() => void> = [];

    const context: MapContext = { map, ready };
    provide(MAP_KEY, context);

    onMounted(async () => {
      const created = await createMapSession(el.value!, {
        tk: props.tk,
        projection: props.projection,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        maxBounds: props.limitBounds,
        center: toLngLat(props.center ?? [116.404, 39.915]),
        zoom: props.zoom,
      });
      session.value = created;
      map.value = created.map;

      // SDK 事件签名按事件名各异，桥的泛型在此处统一放宽为 unknown 转发
      const events = created.events as unknown as {
        on(event: string, handler: (event: unknown) => void): () => void;
      };
      for (const name of MAP_EVENT_NAMES) {
        stopWatchers.push(events.on(name, (event) => emit(name, event)));
      }

      // 交互开关仅在初始化时整体应用一次；这些开关变更不重建地图
      applyInteractions(created.map, props);

      if (props.mapType) {
        // types 包暂未声明 setMapType，SDK 实际提供该方法
        (created.map as unknown as { setMapType(type: T.MapType): void }).setMapType(props.mapType);
      }

      ready.value = true;
      emit("ready", created.map);
    });

    onBeforeUnmount(() => {
      for (const stop of stopWatchers.splice(0)) {
        stop();
      }
      session.value?.destroy();
      session.value = undefined;
      map.value = undefined;
      ready.value = false;
    });

    expose({
      map,
      session,
      ready,
    });

    return () => h("div", { ref: el, style: { width: "100%", height: "100%" } }, slots.default?.());
  },
});

function applyInteractions(map: T.Map, props: TdtMapProps): void {
  const toggles = [
    ["dragging", "Drag"],
    ["scrollWheelZoom", "ScrollWheelZoom"],
    ["doubleClickZoom", "DoubleClickZoom"],
    ["keyboard", "Keyboard"],
    ["inertia", "Inertia"],
    ["continuousZoom", "ContinuousZoom"],
    ["pinchToZoom", "PinchToZoom"],
  ] as const;

  for (const [prop, method] of toggles) {
    const enable = props[prop] !== false;
    const prefix = enable ? "enable" : "disable";
    (map as unknown as Record<string, () => void>)[prefix + method]();
  }
}
