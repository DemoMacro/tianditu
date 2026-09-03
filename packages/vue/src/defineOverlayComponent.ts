import { createPropsSync, type SyncDef } from "@tianditu/core";
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

export interface OverlayContext {
  map: T.Map;
  /** 存在时表示当前处于 MarkerClusterer 内部，覆盖物应加入聚合而非直接上屏 */
  collector?: { addMarker(marker: T.Marker): void; removeMarker(marker: T.Marker): void };
}

export interface OverlayComponentOptions<P extends object, O> {
  name: string;
  /** 运行时 props 定义；静态形状由泛型 P 声明并与其对齐 */
  props: ComponentObjectPropsOptions;
  /** 需要转发为组件事件的覆盖物事件名（SDK 原生名直发） */
  events?: readonly string[];
  /** 额外的 setup 逻辑（在 setup 同步上下文内调用，可 provide 子级所需上下文） */
  setup?(context: { instance: ShallowRef<O | undefined> }): void;
  /** 构造覆盖物，须在其中完成上屏或加入聚合 */
  create(props: P, context: OverlayContext): O;
  /** 卸载覆盖物，默认 map.removeOverLay */
  destroy?(instance: O, context: OverlayContext): void;
  /** 响应式 props → 覆盖物 setter 的同步定义 */
  sync?: SyncDef<O, P>;
}

/**
 * 覆盖物组件工厂：统一处理"等待地图就绪 → 创建挂载 → props 同步 →
 * 事件转发 → 卸载清理"的生命周期，各覆盖物组件只声明差异部分。
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

      let context: OverlayContext | undefined;
      let stopSync: (() => void) | undefined;
      let stopEvents: Array<() => void> = [];

      // setup 内注册的 watch 随组件实例自动停止
      watch(
        map,
        (current) => {
          if (!current || instance.value) {
            return;
          }
          context = collector ? { map: current, collector } : { map: current };
          const created = options.create(props as P, context);
          instance.value = created;

          if (options.sync) {
            stopSync = createPropsSync(
              () => instance.value,
              () => props as P,
              options.sync,
            );
          }

          if (options.events) {
            for (const name of options.events) {
              const target = created as unknown as {
                addEventListener(event: string, handler: (e: unknown) => void): void;
                removeEventListener(event: string, handler: (e: unknown) => void): void;
              };
              const handler = (event: unknown) => emit(name, event);
              target.addEventListener(name, handler);
              stopEvents.push(() => target.removeEventListener(name, handler));
            }
          }
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        stopSync?.();
        for (const stop of stopEvents.splice(0)) {
          stop();
        }
        if (instance.value && context) {
          const destroy =
            options.destroy ??
            ((target: O, ctx: OverlayContext) => {
              ctx.map.removeOverLay(target as unknown as T.Overlay);
            });
          destroy(instance.value, context);
          instance.value = undefined;
        }
      });

      return () => slots.default?.();
    },
  });
}
