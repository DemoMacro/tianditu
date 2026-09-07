import {
  createWhenReady,
  mountTool,
  type ToolDef,
  type ToolLike,
  type ToolSession,
} from "@tianditu/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { useMap } from "./context";
import { dispatchToProps } from "./eventHandlers";
import type { EventHandlers } from "./types";
import { useDelayedTeardown } from "./useDelayedTeardown";

/** 经 ref 暴露的 SDK 工具句柄（对齐 vue 适配层 expose({ tool })） */
export interface TdtToolRef {
  /** SDK 工具实例；就绪前为 undefined */
  readonly tool: ToolLike | undefined;
}

/**
 * 工具组件工厂：消费 core 的框架无关定义（ToolDef）。core 的 mountTool 负责
 * "创建 → 事件挂接 → 开关 → 卸载"编排，此处只做胶水——受控 active 驱动
 * 开关，事件以 onXxx 回调直发。卸载时仅关闭工具——工具绘制的图形属于
 * 用户数据，由调用方通过 ref 的实例自行决定是否 clear。
 */
export function defineToolComponent<P extends object>(def: ToolDef<P>) {
  type Props = P & EventHandlers<typeof def.events> & { active?: boolean };

  const ToolComponent = forwardRef<TdtToolRef, Props>(function ToolComponent(props, ref) {
    const { map } = useMap();
    const latest = useRef(props);
    latest.current = props;
    const sessionRef = useRef<ToolSession | undefined>(undefined);

    // 会话销毁延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
    const teardown = useDelayedTeardown(() => {
      sessionRef.current?.destroy();
      sessionRef.current = undefined;
    });

    useEffect(() => {
      if (!map) {
        return;
      }
      // 重挂复用已有会话（StrictMode 双挂载视为同一次使用）
      teardown.cancel();
      if (sessionRef.current) {
        return;
      }
      // 守卫创建落定前组件可能已替换（真实卸载/HMR），落定时不得再挂载
      let disposed = false;
      // 构造经 createWhenReady 守卫（SDK 扩展组件包异步加载，过早构造
      // 扩展类会抛 "is not a constructor"），就绪后再编排开关
      void createWhenReady(() => def.create(latest.current as P, map)).then((created) => {
        if (disposed || sessionRef.current) {
          return;
        }
        const session = mountTool({
          map,
          create: () => created,
          events: def.events,
          dispatch: (name, event) => dispatchToProps(latest.current, name, event),
          // 未自定义开关动作时为 undefined，走 mountTool 默认的 open()/close()
          activate: def.activate,
          deactivate: def.deactivate,
        });
        sessionRef.current = session;
        session.setActive(Boolean(latest.current.active));
      });
      return () => {
        disposed = true;
        teardown.schedule();
      };
    }, [map]);

    useEffect(() => {
      sessionRef.current?.setActive(Boolean(props.active));
    }, [props.active]);

    useImperativeHandle(
      ref,
      () => ({
        get tool() {
          return sessionRef.current?.tool;
        },
      }),
      [],
    );
    return null;
  });
  ToolComponent.displayName = def.name;
  return ToolComponent;
}
