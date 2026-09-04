import { createInfoWindow, type InfoWindowHandle } from "@tianditu/core";
import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  shallowRef,
  watch,
  type PropType,
} from "vue";

import { MAP_KEY, OVERLAY_KEY } from "../context";

/**
 * 信息窗组件。窗体构造与开关在 core 的 createInfoWindow（转发官方
 * host.openInfoWindow / closeInfoWindow）。slot 内容先渲染进本地锚点，
 * 再经 MutationObserver 同步进窗体容器：SDK 会在 open 时搬移内容容器，
 * Teleport 以该容器为目标时在 detached 节点上不生效。
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
    autoPanPadding: { type: Object as PropType<T.Point>, default: undefined },
    closeOnClick: { type: Boolean, default: undefined },
  },
  emits: ["update:open", "open", "close", "clickclose"],
  setup(props, { emit, slots }) {
    const { map } = inject(MAP_KEY)!;
    const host = inject(OVERLAY_KEY, undefined) as { value: T.Marker | undefined } | undefined;
    const anchor = shallowRef<HTMLElement>();
    let handle: InfoWindowHandle | undefined;
    let observer: MutationObserver | undefined;

    const target = computed(() => (props.lnglat ? map.value : host?.value));

    /** 把锚点内容克隆进窗体容器（搬移会让锚点变空、再次触发同步时误清窗口） */
    function syncContent() {
      if (anchor.value && handle) {
        handle.container.replaceChildren(
          ...Array.from(anchor.value.childNodes, (node) => node.cloneNode(true)),
        );
      }
    }

    watch(
      [anchor, target, () => props.open],
      ([el, current, open]) => {
        observer?.disconnect();
        observer = undefined;
        if (!el || !current) {
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
              autoPanPadding: props.autoPanPadding,
              closeOnClick: props.closeOnClick,
            },
            (name) => {
              emit(name);
              if (name === "close") {
                emit("update:open", false);
              }
            },
          );
        }
        // 锚点内容后续更新（含首次渲染）经 MutationObserver 持续同步
        observer = new MutationObserver(syncContent);
        observer.observe(el, { childList: true, subtree: true, characterData: true });
        syncContent();
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
      observer?.disconnect();
      observer = undefined;
      handle?.destroy();
      handle = undefined;
    });

    return () => h("div", { ref: anchor, style: { display: "none" } }, slots.default?.());
  },
});
