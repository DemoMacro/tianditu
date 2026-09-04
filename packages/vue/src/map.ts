import {
  applyMapInteractions,
  createMapSession,
  MAP_EVENT_NAMES,
  toLngLat,
  type MapSession,
} from "@tianditu/core";
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
 * 转发给 SDK 的地图事件名。以官方 Map 文档页的 14 个事件为准（原生事件名
 * 直发，payload 为原生 T 事件对象）；文档外事件经 useMap 命令式监听。
 */
export { MAP_EVENT_NAMES } from "@tianditu/core";

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
  /** 显示范围限制 */
  limitBounds?: T.LngLatBounds;
  dragging?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  keyboard?: boolean;
  inertia?: boolean;
  continuousZoom?: boolean;
  pinchToZoom?: boolean;
  autoResize?: boolean;
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
    autoResize: { type: Boolean, default: undefined },
  },
  emits: ["ready", ...MAP_EVENT_NAMES],
  setup(props, { emit, slots, expose }) {
    const el = ref<HTMLElement>();
    const map = shallowRef<T.Map>();
    const session = shallowRef<MapSession>();
    const ready = shallowRef(false);
    let stopEvents: Array<() => void> = [];

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
        stopEvents.push(events.on(name, (event) => emit(name, event)));
      }

      // 交互开关仅在初始化时整体应用一次；这些开关变更不重建地图
      applyMapInteractions(created.map, {
        dragging: props.dragging,
        scrollWheelZoom: props.scrollWheelZoom,
        doubleClickZoom: props.doubleClickZoom,
        keyboard: props.keyboard,
        inertia: props.inertia,
        continuousZoom: props.continuousZoom,
        pinchToZoom: props.pinchToZoom,
        autoResize: props.autoResize,
      });

      ready.value = true;
      emit("ready", created.map);
    });

    onBeforeUnmount(() => {
      for (const stop of stopEvents.splice(0)) {
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
