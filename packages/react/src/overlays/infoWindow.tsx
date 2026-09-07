import { createInfoWindow, createWhenReady, toLngLat, type InfoWindowHandle } from "@tianditu/core";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { HostContext, useMap } from "../context";
import { useDelayedTeardown } from "../useDelayedTeardown";

/** 信息窗 props（对齐官方 InfoWindowOptions 与 vue 适配层的组件 props） */
export interface TdtInfoWindowProps {
  /** 是否打开；SDK 关闭（closeOnClick 等）后回调 onClose，由调用方回写 */
  open?: boolean;
  /** 直接传坐标时由地图打开；不传时嵌套于覆盖物内经宿主打开 */
  lnglat?: [number, number] | T.LngLat;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  autoPan?: boolean;
  closeButton?: boolean;
  offset?: T.Point;
  autoPanPadding?: T.Point;
  closeOnClick?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onClickClose?: () => void;
  children?: ReactNode;
}

/**
 * 信息窗组件。窗体构造与开关在 core 的 createInfoWindow（转发官方
 * host.openInfoWindow / closeInfoWindow）。children 先渲染进本地锚点，
 * 再经 MutationObserver 同步进窗体容器：SDK 会在 open 时搬移内容容器，
 * portal 以该容器为目标时在 detached 节点上不生效。
 * 嵌套在 TdtMarker 内时通过父级打开；也可直接传 lnglat 由地图打开。
 */
export function TdtInfoWindow(props: TdtInfoWindowProps) {
  const { open = false, lnglat, children } = props;
  const { map } = useMap();
  // 嵌套在覆盖物内时取宿主实例（工厂以 state 提供宿主，就绪即触发重渲染）
  const host = useContext(HostContext) as T.Marker | undefined;
  const anchorRef = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const winRef = useRef<InfoWindowHandle | undefined>(undefined);
  const [win, setWin] = useState<InfoWindowHandle | undefined>(undefined);
  const target: T.Map | T.Marker | undefined = lnglat ? map : host;

  // 窗体销毁延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
  const teardown = useDelayedTeardown(() => {
    winRef.current?.destroy();
    winRef.current = undefined;
    setWin(undefined);
  });

  // 锚点就绪且有打开目标时构造窗体（createWhenReady 守卫 SDK 扩展包加载）
  useEffect(() => {
    if (!target) {
      return;
    }
    // 重挂复用已有窗体（StrictMode 双挂载视为同一次使用）
    teardown.cancel();
    if (winRef.current) {
      return;
    }
    let disposed = false;
    void createWhenReady(() =>
      createInfoWindow(
        {
          minWidth: latest.current.minWidth,
          maxWidth: latest.current.maxWidth,
          maxHeight: latest.current.maxHeight,
          autoPan: latest.current.autoPan,
          closeButton: latest.current.closeButton,
          offset: latest.current.offset,
          autoPanPadding: latest.current.autoPanPadding,
          closeOnClick: latest.current.closeOnClick,
        },
        (name) => {
          if (name === "open") {
            latest.current.onOpen?.();
          } else if (name === "close") {
            latest.current.onClose?.();
          } else if (name === "clickclose") {
            latest.current.onClickClose?.();
          }
        },
      ),
    ).then((created) => {
      if (disposed || winRef.current) {
        return;
      }
      winRef.current = created;
      setWin(created);
    });
    return () => {
      disposed = true;
      teardown.schedule();
    };
  }, [target]);

  // 锚点内容后续更新（含首次渲染）经 MutationObserver 持续同步进窗体容器
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!win || !anchor) {
      return;
    }
    const syncContent = () => {
      if (anchorRef.current) {
        // 克隆而非搬移：搬移会让锚点变空、再次触发同步时误清窗口
        win.container.replaceChildren(
          ...Array.from(anchorRef.current.childNodes, (node) => node.cloneNode(true)),
        );
      }
    };
    const observer = new MutationObserver(syncContent);
    observer.observe(anchor, { childList: true, subtree: true, characterData: true });
    syncContent();
    return () => {
      observer.disconnect();
    };
  }, [win]);

  // 开关与重定位：官方 openInfoWindow 幂等重开，已打开时坐标变化即重定位
  useEffect(() => {
    if (!win || !target) {
      return;
    }
    if (open) {
      win.openOn(target, lnglat ? toLngLat(lnglat) : undefined);
    } else if (win.isOpen()) {
      win.close();
    }
  }, [win, target, open, lnglat]);

  return (
    <div ref={anchorRef} style={{ display: "none" }}>
      {children}
    </div>
  );
}
