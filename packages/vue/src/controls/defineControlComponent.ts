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
 * 泛型 P 为组件 props 的静态形状，与运行时 props 对象手工对齐。
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

      watch(
        map,
        (current) => {
          if (!current || control.value) {
            return;
          }
          const created = options.create(props as P);
          current.addControl(created);
          control.value = created;
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        if (control.value && map.value) {
          map.value.removeControl(control.value);
          control.value = undefined;
        }
      });

      return () => slots.default?.();
    },
  });
}
