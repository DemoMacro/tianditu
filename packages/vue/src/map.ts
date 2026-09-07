import {
  applyMapInteractions,
  bindEventNames,
  createMapSession,
  MAP_EVENT_NAMES,
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
  watch,
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
  /** 中心点 [lng, lat]；不传时回退北京，locate 开启时定位用户位置 */
  center?: [number, number];
  /**
   * center 不传时的定位方式；默认 false（回退北京，零定位调用）。
   * - "geolocation"：仅浏览器定位（触发授权请求、高精度）
   * - "ip"：仅官方 IP 定位（城市级）
   * - "auto" 或 true：优先浏览器定位，失败回退 IP 定位
   */
  locate?: boolean | "geolocation" | "ip" | "auto";
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
      default: undefined,
    },
    locate: {
      type: [Boolean, String] as unknown as PropType<TdtMapProps["locate"]>,
      default: false,
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
    let unbindEvents: (() => void) | undefined;

    const context: MapContext = { map, ready };
    provide(MAP_KEY, context);

    // zoom/center 的响应式同步：地图就绪前变更由初始化吸收，就绪后直发 SDK
    watch(
      () => props.zoom,
      (value) => {
        if (map.value) {
          map.value.setZoom(value);
        }
      },
    );
    watch(
      () => props.center,
      (value) => {
        // 此时 SDK 必已加载完成（map 就绪是 loadTdt 之后的信号）
        if (session.value && value) {
          session.value.setCenter(value);
        }
      },
    );

    onMounted(async () => {
      const created = await createMapSession(el.value!, {
        tk: props.tk,
        projection: props.projection,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        maxBounds: props.limitBounds,
        // center 保持数组直传：SDK 值（T.LngLat）构造必须发生在 loadTdt 完成后，
        // 由 createMapSession 内部转换，组件 setup/mounted 同步段不得触碰全局 T
        center: props.center,
        locate: props.locate,
        zoom: props.zoom,
      });
      session.value = created;
      map.value = created.map;

      // 官方事件以原生事件名转发（payload 为原生 T 事件对象）
      unbindEvents = bindEventNames(created.map, MAP_EVENT_NAMES, (name, event) =>
        emit(name as never, event as never),
      );

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
      unbindEvents?.();
      unbindEvents = undefined;
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

    // isolation 创建独立的 stacking context：SDK 内部控件层的高 z-index
    // 不会逃逸出地图容器，避免盖住宿主页面叠加的元素
    return () =>
      h(
        "div",
        { ref: el, style: { width: "100%", height: "100%", isolation: "isolate" } },
        slots.default?.(),
      );
  },
});
