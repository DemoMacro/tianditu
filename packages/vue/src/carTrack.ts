import { mountCarTrack, type CarTrackSpec } from "@tianditu/core";
import { defineComponent, inject, onBeforeUnmount, shallowRef, watch, type PropType } from "vue";

import { MAP_KEY } from "./context";

export type CarTrackProps = CarTrackSpec;

/**
 * 车辆轨迹组件：构造与播放编排由 core 的 mountCarTrack 承担，
 * 此处只做响应式胶水。passOneNode 转写为 @pass-one-node 事件。
 */
export const TdtCarTrack = defineComponent({
  name: "TdtCarTrack",
  props: {
    datas: { type: Array as unknown as PropType<CarTrackProps["datas"]>, default: undefined },
    interval: { type: Number, default: undefined },
    speed: { type: Number, default: undefined },
    dynamicLine: { type: Boolean, default: undefined },
    carstyle: { type: Object as PropType<CarTrackProps["carstyle"]>, default: undefined },
    polylinestyle: {
      type: Object as PropType<CarTrackProps["polylinestyle"]>,
      default: undefined,
    },
  },
  emits: {
    "pass-one-node": (_payload: { lnglat: T.LngLat; index: number; length: number }) => true,
  },
  setup(props, { emit, expose }) {
    const { map } = inject(MAP_KEY)!;
    const carTrack = shallowRef<T.CarTrack>();
    let session: ReturnType<typeof mountCarTrack> | undefined;

    watch(
      map,
      (current) => {
        if (!current || session) {
          return;
        }
        session = mountCarTrack(current, props as CarTrackProps, (lnglat, index, length) =>
          emit("pass-one-node", { lnglat, index, length }),
        );
        carTrack.value = session.carTrack;
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      session?.destroy();
      session = undefined;
      carTrack.value = undefined;
    });

    expose({
      carTrack,
      start: () => session?.start(),
      stop: () => session?.stop(),
      pause: () => session?.pause(),
      clear: () => session?.destroy(),
    });
    return () => null;
  },
});
