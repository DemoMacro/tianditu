import { createWhenReady } from "@tianditu/core";
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  shallowRef,
  watch,
  type ComponentObjectPropsOptions,
  type PropType,
} from "vue";

import { MAP_KEY } from "../context";

export const controlPositionProp = {
  position: {
    type: String as PropType<T.ControlPosition>,
    default: undefined,
  },
};

/**
 * 控件组件工厂：等待地图就绪后构造控件并 addControl，卸载时 removeControl。
 * 构造经 createWhenReady 守卫——SDK 扩展组件包异步加载，过早构造扩展类
 * 会抛 "is not a constructor"，守卫内自动等待重试。
 */
export function defineControlComponent<P extends object>(options: {
  name: string;
  props: ComponentObjectPropsOptions;
  create(props: P): T.Control;
}) {
  return defineComponent({
    name: options.name,
    props: options.props,
    setup(props, { slots }) {
      const { map } = inject(MAP_KEY)!;
      const control = shallowRef<T.Control>();
      // 守卫等待期间组件可能已卸载，落定时不得再挂载
      let disposed = false;

      watch(
        map,
        (current) => {
          if (!current || control.value) {
            return;
          }
          void createWhenReady(() => options.create(props as P)).then((created) => {
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
