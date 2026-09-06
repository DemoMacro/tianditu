import {
  createWhenReady,
  mountTool,
  type ToolDef,
  type ToolLike,
  type ToolSession,
} from "@tianditu/core";
import { defineComponent, inject, onBeforeUnmount, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";
import { vuePropsFromDef } from "../props";

/**
 * 工具组件工厂：消费 core 的框架无关定义（ToolDef）。core 的 mountTool 负责
 * "创建 → 事件挂接 → 开关 → 卸载"编排，此处只做响应式胶水——受控 active
 * prop 驱动开关，事件以 SDK 原生事件名直发。卸载时仅关闭工具——工具绘制的
 * 图形属于用户数据，由调用方通过 expose 的实例自行决定是否 clear。
 */
export function defineToolComponent<P extends object>(def: ToolDef<P>) {
  return defineComponent({
    name: def.name,
    props: {
      /** 受控开关：true 开启工具，false 关闭 */
      active: { type: Boolean, default: undefined },
      ...vuePropsFromDef(def.props),
    },
    emits: def.events ? [...def.events] : [],
    setup(props, { emit, expose }) {
      const { map } = inject(MAP_KEY)!;
      const tool = shallowRef<ToolLike>();
      let session: ToolSession | undefined;
      // 守卫等待期间组件可能已卸载，落定时不得再挂载
      let disposed = false;

      watch(
        map,
        (current) => {
          if (!current || session) {
            return;
          }
          // 构造经 createWhenReady 守卫（SDK 扩展组件包异步加载，过早构造
          // 扩展类会抛 "is not a constructor"），就绪后再编排开关
          void createWhenReady(() => def.create(props as P, current)).then((created) => {
            if (disposed || !map.value || session) {
              return;
            }
            session = mountTool({
              map: current,
              create: () => created,
              events: def.events,
              dispatch: (name, event) => emit(name as never, event as never),
              // 组件未自定义开关动作时不传，走 mountTool 缺省的 open()/close()
              ...(def.activate && { activate: (tool) => def.activate!(tool) }),
              ...(def.deactivate && { deactivate: (tool) => def.deactivate!(tool) }),
            });
            tool.value = session.tool;
            session.setActive(Boolean(props.active));
          });
        },
        { immediate: true },
      );

      watch(
        () => props.active,
        (value) => session?.setActive(Boolean(value)),
      );

      onBeforeUnmount(() => {
        disposed = true;
        session?.destroy();
        session = undefined;
        tool.value = undefined;
      });

      expose({ tool });
      return () => null;
    },
  });
}
