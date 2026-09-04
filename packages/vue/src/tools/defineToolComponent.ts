import { mountTool, type ToolLike, type ToolSession } from "@tianditu/core";
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  shallowRef,
  watch,
  type ComponentObjectPropsOptions,
} from "vue";

import { MAP_KEY } from "../context";

/**
 * 工具组件工厂：core 的 mountTool 负责"创建 → 事件挂接 → 开关 → 卸载"编排，
 * 此处只做响应式胶水——受控 active prop 驱动开关，事件以 SDK 原生事件名直发。
 * 卸载时仅关闭工具——工具绘制的图形属于用户数据，由调用方通过 expose 的
 * 实例自行决定是否 clear。
 */
export function defineToolComponent<P extends object>(options: {
  name: string;
  props: ComponentObjectPropsOptions;
  events?: readonly string[];
  create(props: P, map: T.Map): ToolLike;
  /** 缺省调用 tool.open()（Mousetool 语义） */
  activate?(tool: ToolLike): void;
  deactivate?(tool: ToolLike): void;
}) {
  return defineComponent({
    name: options.name,
    props: {
      /** 受控开关：true 开启工具，false 关闭 */
      active: { type: Boolean, default: undefined },
    },
    emits: options.events ? [...options.events] : [],
    setup(props, { emit, expose }) {
      const { map } = inject(MAP_KEY)!;
      const tool = shallowRef<ToolLike>();
      let session: ToolSession | undefined;

      watch(
        map,
        (current) => {
          if (!current || session) {
            return;
          }
          session = mountTool({
            map: current,
            create: () => options.create(props as P, current),
            events: options.events,
            dispatch: (name, event) => emit(name as never, event as never),
            activate: (tool) => options.activate?.(tool),
            deactivate: (tool) => options.deactivate?.(tool),
          });
          tool.value = session.tool;
          session.setActive(Boolean(props.active));
        },
        { immediate: true },
      );

      watch(
        () => props.active,
        (value) => session?.setActive(Boolean(value)),
      );

      onBeforeUnmount(() => {
        session?.destroy();
        session = undefined;
        tool.value = undefined;
      });

      expose({ tool });
      return () => null;
    },
  });
}
