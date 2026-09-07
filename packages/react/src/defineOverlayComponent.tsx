import { createWhenReady, mountOverlay, type OverlayDef, type OverlayHandle } from "@tianditu/core";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { HostContext, useCollector, useMap } from "./context";
import { dispatchToProps } from "./eventHandlers";
import type { EventHandlers } from "./types";
import { useDelayedTeardown } from "./useDelayedTeardown";
import { usePropsSync } from "./usePropsSync";

/** 经 ref 暴露的 SDK 实例句柄（对齐 vue 适配层 expose({ instance })） */
export interface TdtOverlayRef<O> {
  /** SDK 实例；就绪前为 undefined */
  readonly instance: O | undefined;
}

export interface OverlayExtendOptions<O> {
  /**
   * 额外的包装逻辑（结果经 useMemo 缓存，仅构建一次，内部不可使用
   * hooks）。返回包装函数，由工厂以子级为参调用——collector 组件借此
   * 提供引用稳定的就近收编上下文。
   */
  setup?(context: { instanceRef: RefObject<O | undefined> }): (children: ReactNode) => ReactNode;
}

/**
 * 覆盖物组件工厂：消费 core 的框架无关定义（OverlayDef），此处只剩
 * Context 取图 → map 就绪 → mount → unmount destroy 的胶水。生命周期编排
 * （创建挂载 → 事件转发 → 卸载清理）全部在 core 的 mountOverlay；props
 * 同步由 usePropsSync 的 diff 驱动，不走 core 的响应式引擎。
 */
export function defineOverlayComponent<P extends object, O>(
  def: OverlayDef<P, O>,
  extend?: OverlayExtendOptions<O>,
) {
  type Props = P & EventHandlers<typeof def.events> & { children?: ReactNode };

  const OverlayComponent = forwardRef<TdtOverlayRef<O>, Props>(
    function OverlayComponent(props, ref) {
      const { map } = useMap();
      // 命中聚合或图层容器时覆盖物加入容器而非直接上屏（就近优先：内层容器收编）
      const collector = useCollector();
      // 渲染体内同步最新 props：事件派发与构造读取不需要回调身份稳定
      const latest = useRef(props);
      latest.current = props;
      const instanceRef = useRef<O | undefined>(undefined);
      const handleRef = useRef<OverlayHandle<O> | undefined>(undefined);
      // HostContext 的 value 用 state：实例就绪触发子级（InfoWindow）重渲染
      const [instance, setInstance] = useState<O | undefined>(undefined);

      // extend 包装器只构建一次：collector 等上下文值保持引用稳定，
      // 避免子级以 collector 为依赖的 effect 反复重挂
      const wrap = useMemo(() => extend?.setup?.({ instanceRef }), [extend]);

      // 挂载销毁延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
      const teardown = useDelayedTeardown(() => {
        handleRef.current?.destroy();
        handleRef.current = undefined;
        instanceRef.current = undefined;
        setInstance(undefined);
      });

      useEffect(() => {
        if (!map) {
          return;
        }
        // 重挂复用已有实例（StrictMode 双挂载视为同一次使用）
        teardown.cancel();
        if (handleRef.current) {
          return;
        }
        // 守卫创建落定前组件可能已替换（真实卸载/HMR），落定时不得再挂载
        let disposed = false;
        // 构造经 createWhenReady 守卫（SDK 扩展组件包异步加载，过早构造
        // 扩展类会抛 "is not a constructor"），就绪后再同步编排挂载
        void createWhenReady(() => def.create(latest.current as P, { map })).then((created) => {
          if (disposed || handleRef.current) {
            return;
          }
          handleRef.current = mountOverlay(
            { map, collector },
            {
              props: () => latest.current as P,
              // sync 由 usePropsSync 的 React diff 驱动，不走 core 的响应式引擎
              events: def.events,
              dispatch: (name, event) => dispatchToProps(latest.current, name, event),
              create: () => created,
              attach: def.attach,
              detach: def.detach,
            },
          );
          instanceRef.current = handleRef.current.instance;
          setInstance(handleRef.current.instance);
        });
        return () => {
          disposed = true;
          teardown.schedule();
        };
      }, [map, collector]);

      usePropsSync(instanceRef, def.sync, latest.current as P);

      // 经 ref 暴露 SDK 实例：官方未列为事件的命令式方法（addEventListener、
      // get* 读取）走实例原样能力
      useImperativeHandle(
        ref,
        () => ({
          get instance() {
            return instanceRef.current;
          },
        }),
        [],
      );

      return (
        <HostContext.Provider value={instance}>
          {wrap ? wrap(props.children) : props.children}
        </HostContext.Provider>
      );
    },
  );
  OverlayComponent.displayName = def.name;
  return OverlayComponent;
}
