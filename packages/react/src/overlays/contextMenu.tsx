import { compact, createWhenReady, mountOverlay, type OverlayHandle } from "@tianditu/core";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { MenuContext, useMap } from "../context";
import type { TdtOverlayRef } from "../defineOverlayComponent";
import { dispatchToProps } from "../eventHandlers";
import { useDelayedTeardown } from "../useDelayedTeardown";

export type { ContextMenuItemProps } from "./contextMenuItem";

type ContextMenuProps = {
  /** 菜单宽度（官方 ContextMenuOptions.width，默认 120） */
  width?: number;
  onOpen?: (event: unknown) => void;
  onClose?: (event: unknown) => void;
  children?: ReactNode;
};

/**
 * 右键菜单组件：构造经 createWhenReady 守卫（ContextMenu 属异步加载的
 * 扩展类）后经 map.addContextMenu 上屏，菜单项以子组件
 * TdtContextMenuItem 声明。open/close 事件以 onXxx 回调直发。
 */
export const TdtContextMenu = forwardRef<TdtOverlayRef<T.ContextMenu>, ContextMenuProps>(
  function TdtContextMenu(props, ref) {
    const { map } = useMap();
    const latest = useRef(props);
    latest.current = props;
    const handleRef = useRef<OverlayHandle<T.ContextMenu> | undefined>(undefined);
    const [menu, setMenu] = useState<T.ContextMenu | undefined>(undefined);

    // 菜单销毁延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
    //（SDK 未提供 ContextMenu 卸载方法，销毁时仅解绑事件）
    const teardown = useDelayedTeardown(() => {
      handleRef.current?.destroy();
      handleRef.current = undefined;
      setMenu(undefined);
    });

    useEffect(() => {
      if (!map) {
        return;
      }
      // 重挂复用已有菜单（StrictMode 双挂载视为同一次使用）
      teardown.cancel();
      if (handleRef.current) {
        return;
      }
      let disposed = false;
      void createWhenReady(() => new T.ContextMenu(compact({ width: latest.current.width }))).then(
        (instance) => {
          if (disposed || !map || handleRef.current) {
            return;
          }
          // ContextMenu 不是常规 overlay：挂载走 map.addContextMenu
          handleRef.current = mountOverlay(
            { map },
            {
              props: () => ({}),
              events: ["open", "close"],
              dispatch: (name, event) => dispatchToProps(latest.current, name, event),
              create: () => instance,
              attach: (created, ctx) => ctx.map.addContextMenu(created),
              detach: () => {},
            },
          );
          setMenu(handleRef.current.instance);
        },
      );
      return () => {
        disposed = true;
        teardown.schedule();
      };
    }, [map]);

    useImperativeHandle(
      ref,
      () => ({
        get instance() {
          return handleRef.current?.instance;
        },
      }),
      [],
    );

    return <MenuContext.Provider value={menu}>{props.children}</MenuContext.Provider>;
  },
);
