import {
  createPropsSync,
  mountTileLayer,
  tileLayerDef,
  tileLayerTdtDef,
  tileLayerWmsDef,
  type LayerDef,
} from "@tianditu/core";
import { defineComponent, inject, onBeforeUnmount, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";
import { vuePropsFromDef } from "../props";

export type { TileLayerProps, TileLayerWMSProps, TileLayerTDTProps } from "@tianditu/core";

/**
 * 瓦片图层组件工厂：消费 core 的框架无关定义（LayerDef），此处只剩
 * watch(map) → 构造 → mountTileLayer 上屏与事件 → createPropsSync 响应式
 * 同步的胶水。minZoom/maxZoom 仅初始化生效（SDK 无 setter），不进 sync。
 */
export function createTileLayerComponent<P extends object>(def: LayerDef<P>) {
  return defineComponent({
    name: def.name,
    props: vuePropsFromDef(def.props),
    emits: [...(def.events ?? [])],
    setup(props, { emit, expose }) {
      const { map } = inject(MAP_KEY)!;
      const layer = shallowRef<T.TileLayer>();
      let unmount: (() => void) | undefined;
      let stopSync: (() => void) | undefined;

      watch(
        map,
        (current) => {
          if (!current || layer.value) {
            return;
          }
          layer.value = def.create(props as unknown as P);
          unmount = mountTileLayer({
            map: current,
            layer: layer.value,
            events: def.events,
            dispatch: (name, event) => emit(name as never, event),
          });
          if (def.sync) {
            stopSync = createPropsSync(
              () => layer.value,
              () => props as unknown as P,
              def.sync,
            );
          }
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        stopSync?.();
        unmount?.();
        stopSync = undefined;
        unmount = undefined;
        layer.value = undefined;
      });

      expose({ layer });
      return () => null;
    },
  });
}

export const TdtTileLayer = createTileLayerComponent(tileLayerDef);

export const TdtTileLayerWMS = createTileLayerComponent(tileLayerWmsDef);

export const TdtTileLayerTDT = createTileLayerComponent(tileLayerTdtDef);
