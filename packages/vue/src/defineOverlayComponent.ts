import { createWhenReady, mountOverlay, type OverlayDef, type OverlayHandle } from "@tianditu/core";
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  shallowRef,
  watch,
  type ShallowRef,
} from "vue";

import { CLUSTER_KEY, LAYER_GROUP_KEY, MAP_KEY, OVERLAY_KEY } from "./context";
import { vuePropsFromDef } from "./props";

export interface OverlayExtendOptions<O> {
  /** 额外的 setup 逻辑（在 setup 同步上下文内调用，可 provide 子级所需上下文） */
  setup?(context: { instance: ShallowRef<O | undefined> }): void;
}

/**
 * 覆盖物组件工厂：消费 core 的框架无关定义（OverlayDef），此处只剩
 * inject 上下文 → watch(map) → mount → unmount destroy 的响应式胶水。
 * 生命周期编排（创建挂载 → props 同步 → 事件转发 → 卸载清理）全部在
 * core 的 mountOverlay。
 */
export function defineOverlayComponent<P extends object, O>(
  def: OverlayDef<P, O>,
  extend?: OverlayExtendOptions<O>,
) {
  return defineComponent({
    name: def.name,
    props: vuePropsFromDef(def.props),
    emits: def.events ? [...def.events] : [],
    setup(props, { emit, slots, expose }) {
      const { map } = inject(MAP_KEY)!;
      // 命中聚合或图层容器时覆盖物加入容器而非直接上屏（就近优先：内层容器收编）
      const collector = inject(LAYER_GROUP_KEY, undefined) ?? inject(CLUSTER_KEY, undefined);
      const instance = shallowRef<O>();
      provide(OVERLAY_KEY, instance);
      // 经 expose 暴露 SDK 实例：官方未列组件事件的方法（addEventListener
      // 命令式挂接、get* 读取）走实例原样能力
      expose({ instance });
      extend?.setup?.({ instance });

      let handle: OverlayHandle<O> | undefined;
      // 守卫等待期间组件可能已卸载，落定时不得再挂载
      let disposed = false;

      // setup 内注册的 watch 随组件实例自动停止
      watch(
        map,
        (current) => {
          if (!current || handle) {
            return;
          }
          // 构造经 createWhenReady 守卫（SDK 扩展组件包异步加载，过早构造
          // 扩展类会抛 "is not a constructor"），就绪后再同步编排挂载
          void createWhenReady(() => def.create(props as P, { map: current })).then((created) => {
            if (disposed || !map.value || handle) {
              return;
            }
            handle = mountOverlay(
              { map: current, collector },
              {
                props: () => props as P,
                sync: def.sync,
                events: def.events,
                dispatch: (name, event) => emit(name, event),
                create: () => created,
                attach: def.attach,
                detach: def.detach,
              },
            );
            instance.value = handle.instance;
          });
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        disposed = true;
        handle?.destroy();
        handle = undefined;
        instance.value = undefined;
      });

      return () => slots.default?.();
    },
  });
}
