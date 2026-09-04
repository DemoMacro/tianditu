import { createInfoWindow, type InfoWindowHandle } from "@tianditu/core";
import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  shallowRef,
  Teleport,
  watch,
  type PropType,
} from "vue";

import { MAP_KEY, OVERLAY_KEY } from "../context";

/**
 * 信息窗组件。窗体构造与开关在 core 的 createInfoWindow（转发官方
 * host.openInfoWindow / closeInfoWindow），slot 内容经 Teleport 渲染进
 * 窗体 DOM 容器，保留当前应用的组件上下文。
 * 嵌套在 TdtMarker 内时通过父级打开；也可直接传 lnglat 由地图打开。
 */
export const TdtInfoWindow = defineComponent({
  name: "TdtInfoWindow",
  props: {
    open: { type: Boolean, default: false },
    lnglat: {
      type: Array as unknown as PropType<[number, number] | T.LngLat>,
      default: undefined,
    },
    minWidth: { type: Number, default: undefined },
    maxWidth: { type: Number, default: undefined },
    maxHeight: { type: Number, default: undefined },
    autoPan: { type: Boolean, default: undefined },
    closeButton: { type: Boolean, default: undefined },
    offset: { type: Object as PropType<T.Point>, default: undefined },
  },
  emits: ["update:open", "open", "close", "clickclose"],
  setup(props, { emit, slots }) {
    const { map } = inject(MAP_KEY)!;
    const host = inject(OVERLAY_KEY, undefined) as { value: T.Marker | undefined } | undefined;
    const container = shallowRef<HTMLElement>();
    let handle: InfoWindowHandle | undefined;

    const target = computed(() => (props.lnglat ? map.value : host?.value));

    watch(
      [target, () => props.open],
      ([current, open]) => {
        if (!current) {
          return;
        }
        if (!handle) {
          handle = createInfoWindow(
            {
              minWidth: props.minWidth,
              maxWidth: props.maxWidth,
              maxHeight: props.maxHeight,
              autoPan: props.autoPan,
              closeButton: props.closeButton,
              offset: props.offset,
            },
            (name) => {
              emit(name);
              if (name === "close") {
                emit("update:open", false);
              }
            },
          );
          container.value = handle.container;
        }
        syncOpen(open, current);
      },
      { immediate: true },
    );

    // 已打开时坐标变化即重定位（官方 openInfoWindow 幂等重开）
    watch(
      () => props.lnglat,
      () => {
        if (handle && target.value && props.open) {
          syncOpen(true, target.value);
        }
      },
    );

    function syncOpen(open: boolean, current: T.Map | T.Marker) {
      if (!handle) {
        return;
      }
      if (open) {
        handle.openOn(current, props.lnglat ? toLngLatValue(props.lnglat) : undefined);
      } else if (handle.isOpen()) {
        handle.close();
      }
    }

    function toLngLatValue(value: [number, number] | T.LngLat): T.LngLat {
      return Array.isArray(value) ? new T.LngLat(value[0], value[1]) : value;
    }

    onBeforeUnmount(() => {
      handle?.destroy();
      handle = undefined;
      container.value = undefined;
    });

    return () =>
      container.value && slots.default ? h(Teleport, { to: container.value }, slots.default) : null;
  },
});
