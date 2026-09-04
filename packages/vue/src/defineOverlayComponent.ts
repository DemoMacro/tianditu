import { mountOverlay, type OverlayHandle, type SyncDef } from "@tianditu/core";
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  shallowRef,
  watch,
  type ComponentObjectPropsOptions,
  type ShallowRef,
} from "vue";

import { CLUSTER_KEY, MAP_KEY, OVERLAY_KEY } from "./context";

export interface OverlayComponentOptions<P extends object, O> {
  name: string;
  /** 运行时 props 定义；静态形状由泛型 P 声明并与其对齐 */
  props: ComponentObjectPropsOptions;
  /** 需要转发为组件事件的覆盖物事件名（SDK 原生名直发） */
  events?: readonly string[];
  /** 额外的 setup 逻辑（在 setup 同步上下文内调用，可 provide 子级所需上下文） */
  setup?(context: { instance: ShallowRef<O | undefined> }): void;
  /** 构造覆盖物；上屏由 core 的 attach 编排 */
  create(props: P, ctx: { map: T.Map }): O;
  /** 覆盖缺省挂载（非常规上屏时） */
  attach?(instance: O, ctx: { map: T.Map }): void;
  /** 覆盖缺省卸载（如 MarkerClusterer.clearMarkers） */
  detach?(instance: O, ctx: { map: T.Map }): void;
  /** 响应式 props → 覆盖物 setter 的同步定义 */
  sync?: SyncDef<O, P>;
}

/**
 * 覆盖物组件工厂：纯响应式胶水。生命周期编排（创建挂载 → props 同步 →
 * 事件转发 → 卸载清理）全部在 core 的 mountOverlay，此处只剩
 * inject 上下文 → watch(map) → mount → unmount destroy。
 */
export function defineOverlayComponent<P extends object, O>(
  options: OverlayComponentOptions<P, O>,
) {
  return defineComponent({
    name: options.name,
    props: options.props,
    emits: options.events ? [...options.events] : [],
    setup(props, { emit, slots }) {
      const { map } = inject(MAP_KEY)!;
      const collector = inject(CLUSTER_KEY, undefined);
      const instance = shallowRef<O>();
      provide(OVERLAY_KEY, instance);
      options.setup?.({ instance });

      let handle: OverlayHandle<O> | undefined;

      // setup 内注册的 watch 随组件实例自动停止
      watch(
        map,
        (current) => {
          if (!current || handle) {
            return;
          }
          handle = mountOverlay(
            { map: current, collector },
            {
              props: () => props as P,
              sync: options.sync,
              events: options.events,
              dispatch: (name, event) => emit(name, event),
              create: () => options.create(props as P, { map: current }),
              attach: options.attach
                ? (target, ctx) => options.attach!(target, { map: ctx.map })
                : undefined,
              detach: options.detach
                ? (target, ctx) => options.detach!(target, { map: ctx.map })
                : undefined,
            },
          );
          instance.value = handle.instance;
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        handle?.destroy();
        handle = undefined;
        instance.value = undefined;
      });

      return () => slots.default?.();
    },
  });
}
