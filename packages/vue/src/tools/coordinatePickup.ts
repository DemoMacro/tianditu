import { createWhenReady } from "@tianditu/core";
import { defineComponent, inject, onBeforeUnmount, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";

/**
 * 坐标拾取组件（官方 CoordinatePickup）：非 Mousetool 体系，以
 * addEvent/removeEvent 开关；官方 Options.callback 转写为 @pick 事件
 * （SDK 点击地图即调用 callback，未设置时点击会抛错，故构造必传）。
 */
export const TdtCoordinatePickup = defineComponent({
  name: "TdtCoordinatePickup",
  props: {
    /** 受控开关：true 开启拾取，false 关闭 */
    active: { type: Boolean, default: undefined },
  },
  emits: {
    pick: (_lnglat: T.LngLat) => true,
  },
  setup(props, { emit, expose }) {
    const { map } = inject(MAP_KEY)!;
    const pickup = shallowRef<T.CoordinatePickup>();
    // 守卫等待期间组件可能已卸载，落定时不得再挂载
    let disposed = false;

    watch(
      map,
      (current) => {
        if (!current || pickup.value) {
          return;
        }
        void createWhenReady(
          () =>
            new T.CoordinatePickup(current, {
              callback: (lnglat) => emit("pick", lnglat),
            }),
        ).then((created) => {
          if (disposed || !map.value || pickup.value) {
            return;
          }
          pickup.value = created;
          if (props.active) {
            created.addEvent();
          }
        });
      },
      { immediate: true },
    );

    watch(
      () => props.active,
      (value) => {
        const tool = pickup.value;
        if (!tool) {
          return;
        }
        if (value) {
          tool.addEvent();
        } else {
          tool.removeEvent();
        }
      },
    );

    onBeforeUnmount(() => {
      disposed = true;
      pickup.value?.removeEvent();
      pickup.value = undefined;
    });

    expose({ tool: pickup });
    return () => null;
  },
});
