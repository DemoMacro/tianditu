import { createWhenReady, type ControlDef, type PropDefs } from "@tianditu/core";
import { defineComponent, inject, onBeforeUnmount, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";
import { vuePropsFromDef } from "../props";

// 标绘控件仍在沿用，收敛前保留导出
export const controlPositionProp: PropDefs<{ position?: T.ControlPosition }> = {
  position: {
    type: String,
    default: undefined,
  },
};

/**
 * 控件组件工厂：等待地图就绪后构造控件并 addControl，卸载时 removeControl。
 * 构造经 createWhenReady 守卫——SDK 扩展组件包异步加载，过早构造扩展类
 * 会抛 "is not a constructor"，守卫内自动等待重试。
 */
export function defineControlComponent<P extends object>(def: ControlDef<P>) {
  return defineComponent({
    name: def.name,
    props: vuePropsFromDef(def.props),
    // 经 expose 暴露 SDK 实例：官方控件方法（如 Copyright.addCopyright）
    // 走实例原样能力
    setup(props, { slots, expose }) {
      const { map } = inject(MAP_KEY)!;
      const control = shallowRef<T.Control>();
      expose({ control });
      // 守卫等待期间组件可能已卸载，落定时不得再挂载
      let disposed = false;

      watch(
        map,
        (current) => {
          if (!current || control.value) {
            return;
          }
          void createWhenReady(() => def.create(props as P)).then((created) => {
            if (disposed || !map.value || control.value) {
              return;
            }
            map.value.addControl(created);
            control.value = created;
          });
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        disposed = true;
        if (control.value && map.value) {
          map.value.removeControl(control.value);
          control.value = undefined;
        }
      });

      return () => slots.default?.();
    },
  });
}
