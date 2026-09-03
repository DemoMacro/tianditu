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
 * 信息窗组件。slot 内容经 Teleport 渲染进 T.InfoWindow 的 DOM 容器，
 * 保留当前应用的组件上下文（provide/inject、全局组件可用）。
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
  emits: ["update:open", "open", "close"],
  setup(props, { emit, slots }) {
    const { map } = inject(MAP_KEY)!;
    const host = inject(OVERLAY_KEY, undefined) as { value: T.Marker | undefined } | undefined;
    const container = shallowRef<HTMLDivElement>();
    const win = shallowRef<T.InfoWindow>();

    const target = computed(() => (props.lnglat ? map.value : host?.value));

    watch(
      [target, props],
      ([current]) => {
        if (!current) {
          return;
        }
        if (!win.value) {
          container.value = document.createElement("div");
          win.value = new T.InfoWindow(container.value, {
            minWidth: props.minWidth,
            maxWidth: props.maxWidth,
            maxHeight: props.maxHeight,
            autoPan: props.autoPan,
            closeButton: props.closeButton,
            offset: props.offset,
          });
          const offOpen = bindEvent(win.value, "open", () => emit("open"));
          const offClose = bindEvent(win.value, "close", () => {
            emit("close");
            emit("update:open", false);
          });
          cleanup.push(offOpen, offClose);
        }
        applyOpen(win.value, current, props);
      },
      { immediate: true },
    );

    watch(
      () => props.open,
      (open) => {
        const current = target.value;
        if (win.value && current) {
          applyOpen(win.value, current, { ...props, open });
        }
      },
    );

    const cleanup: Array<() => void> = [];
    onBeforeUnmount(() => {
      for (const off of cleanup.splice(0)) {
        off();
      }
      win.value = undefined;
      container.value = undefined;
    });

    function bindEvent(
      target: T.InfoWindow,
      event: "open" | "close",
      handler: () => void,
    ): () => void {
      const events = target as unknown as {
        addEventListener(event: string, handler: () => void): void;
        removeEventListener(event: string, handler: () => void): void;
      };
      events.addEventListener(event, handler);
      return () => events.removeEventListener(event, handler);
    }

    return () =>
      container.value && slots.default ? h(Teleport, { to: container.value }, slots.default) : null;
  },
});

function applyOpen(
  win: T.InfoWindow,
  host: T.Map | T.Marker,
  props: { open: boolean; lnglat?: [number, number] | T.LngLat },
): void {
  if (props.open) {
    if (host instanceof T.Map) {
      const lnglat = props.lnglat ? toLngLatValue(props.lnglat) : host.getCenter();
      host.openInfoWindow(win, lnglat);
    } else {
      host.openInfoWindow(win);
    }
  } else if (win.isOpen()) {
    (host instanceof T.Map ? host : host.getMap()).closeInfoWindow();
  }
}

function toLngLatValue(value: [number, number] | T.LngLat): T.LngLat {
  return Array.isArray(value) ? new T.LngLat(value[0], value[1]) : value;
}
