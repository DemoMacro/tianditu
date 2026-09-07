import { createWhenReady, type ControlDef } from "@tianditu/core";
import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from "react";

import { useMap } from "./context";
import { useDelayedTeardown } from "./useDelayedTeardown";

/** 经 ref 暴露的 SDK 控件句柄（对齐 vue 适配层 expose({ control })） */
export interface TdtControlRef {
  /** SDK 控件实例；就绪前为 undefined */
  readonly control: T.Control | undefined;
}

/**
 * 控件组件工厂：等待地图就绪后构造控件并 addControl，卸载时 removeControl。
 * 构造经 createWhenReady 守卫——SDK 扩展组件包异步加载，过早构造扩展类
 * 会抛 "is not a constructor"，守卫内自动等待重试。
 */
export function defineControlComponent<P extends object>(def: ControlDef<P>) {
  type Props = P & { children?: ReactNode };

  const ControlComponent = forwardRef<TdtControlRef, Props>(function ControlComponent(props, ref) {
    const { map } = useMap();
    const latest = useRef(props);
    latest.current = props;
    const controlRef = useRef<T.Control | undefined>(undefined);
    // 销毁回调延迟执行，经 ref 解引用当前地图
    const mapRef = useRef<T.Map | undefined>(undefined);

    // 控件移除延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
    const teardown = useDelayedTeardown(() => {
      if (controlRef.current && mapRef.current) {
        mapRef.current.removeControl(controlRef.current);
        controlRef.current = undefined;
      }
    });

    useEffect(() => {
      if (!map) {
        return;
      }
      // 重挂复用已有控件（StrictMode 双挂载视为同一次使用）
      teardown.cancel();
      if (controlRef.current) {
        return;
      }
      mapRef.current = map;
      let disposed = false;
      void createWhenReady(() => def.create(latest.current as P)).then((created) => {
        if (disposed || controlRef.current) {
          return;
        }
        map.addControl(created);
        controlRef.current = created;
      });
      return () => {
        disposed = true;
        teardown.schedule();
      };
    }, [map]);

    // 经 ref 暴露 SDK 实例：官方控件方法（如 Copyright.addCopyright）走实例原样能力
    useImperativeHandle(
      ref,
      () => ({
        get control() {
          return controlRef.current;
        },
      }),
      [],
    );
    return props.children;
  });
  ControlComponent.displayName = def.name;
  return ControlComponent;
}
