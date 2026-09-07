import {
  applyMapInteractions,
  bindEventNames,
  createMapSession,
  MAP_EVENT_NAMES,
  type MapSession,
} from "@tianditu/core";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { MapContext, type MapContextValue } from "./context";
import { dispatchToProps } from "./eventHandlers";
import { useDelayedTeardown } from "./useDelayedTeardown";

/** 转发给 SDK 的地图事件名。以官方 Map 文档页的 14 个事件为准（原生事件名
 * 直发，payload 为原生 T 事件对象）；文档外事件经 useMap 命令式监听。 */
export { MAP_EVENT_NAMES } from "@tianditu/core";

/** 官方地图事件 → onXxx 回调 props（payload 为原生 T 事件对象） */
export type TdtMapEventProps = {
  [K in (typeof MAP_EVENT_NAMES)[number] as `on${Capitalize<K>}`]?: (
    event: Parameters<T.MapEvents[K]>[0],
  ) => void;
};

export type TdtMapProps = {
  /** 开发者密钥，仅初始化时生效 */
  tk: string;
  /** 中心点 [lng, lat]；不传时回退北京，locate 开启时定位用户位置 */
  center?: [number, number];
  /**
   * center 不传时的定位方式；默认 false（回退北京，零定位调用）。
   * - "geolocation"：仅浏览器定位（触发授权请求、高精度）
   * - "ip"：仅官方 IP 定位（城市级）
   * - "auto" 或 true：优先浏览器定位，失败回退 IP 定位
   */
  locate?: boolean | "geolocation" | "ip" | "auto";
  /** 缩放级别 */
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** 投影，仅初始化时生效 */
  projection?: string;
  /** 显示范围限制 */
  limitBounds?: T.LngLatBounds;
  dragging?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  keyboard?: boolean;
  inertia?: boolean;
  continuousZoom?: boolean;
  pinchToZoom?: boolean;
  autoResize?: boolean;
  /** 地图就绪（SDK 加载并完成初始化）后触发 */
  onReady?: (map: T.Map) => void;
  /** 透传到地图容器（容器默认 100% 填充父级） */
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
} & TdtMapEventProps;

/** 经 ref 暴露的地图句柄（对齐 vue 适配层 expose({ map, session, ready })） */
export interface TdtMapRef {
  readonly map: T.Map | undefined;
  readonly session: MapSession | undefined;
  readonly ready: boolean;
}

export const TdtMap = forwardRef<TdtMapRef, TdtMapProps>(function TdtMap(props, ref) {
  // 初始化 props（tk/locate/projection 等）经 latest.current 在 effect 内读取
  const { zoom = 12, center, children } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const sessionRef = useRef<MapSession | undefined>(undefined);
  const unbindRef = useRef<(() => void) | undefined>(undefined);
  // 创建 promise 经 ref 复用：StrictMode 双挂载共享同一次构造。SDK 地图构造
  // 直接写入容器且 destroy 会清空容器（连同 React 管辖的子树），若两次挂载
  // 并发构造，先落定一方的销毁会清掉后一方的地图——构造必须只发生一次
  const pendingRef = useRef<Promise<MapSession> | undefined>(undefined);
  const [session, setSession] = useState<MapSession | undefined>(undefined);
  const map = session?.map;
  const ready = session !== undefined;

  // 会话销毁延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
  const teardown = useDelayedTeardown(() => {
    unbindRef.current?.();
    unbindRef.current = undefined;
    const created = sessionRef.current;
    const pending = pendingRef.current;
    sessionRef.current = undefined;
    pendingRef.current = undefined;
    setSession(undefined);
    if (created) {
      created.destroy();
    } else if (pending) {
      // 创建尚未落定（快速卸载）：落定后立即销毁，避免泄漏
      void pending.then((s) => s.destroy());
    }
  });

  // 初始化仅在挂载时执行一次：tk/projection 等仅初始化生效，变更不重建地图
  useEffect(() => {
    const el = elRef.current;
    if (!el) {
      return;
    }
    // 重挂取消延迟销毁（StrictMode 双挂载视为同一次使用）
    teardown.cancel();
    let cancelled = false;
    pendingRef.current ??= createMapSession(el, {
      tk: latest.current.tk,
      projection: latest.current.projection,
      minZoom: latest.current.minZoom,
      maxZoom: latest.current.maxZoom,
      maxBounds: latest.current.limitBounds,
      // center 保持数组直传：SDK 值（T.LngLat）构造必须发生在 loadTdt 完成后，
      // 由 createMapSession 内部转换，组件渲染同步段不得触碰全局 T
      center: latest.current.center,
      locate: latest.current.locate,
      zoom: latest.current.zoom ?? 12,
    });
    void pendingRef.current.then((createdSession) => {
      if (cancelled || sessionRef.current) {
        return;
      }
      sessionRef.current = createdSession;
      // 官方事件以 onXxx 回调转发（payload 为原生 T 事件对象）
      unbindRef.current = bindEventNames(createdSession.map, MAP_EVENT_NAMES, (name, event) => {
        dispatchToProps(latest.current, name, event);
      });
      // 交互开关仅在初始化时整体应用一次；这些开关变更不重建地图
      applyMapInteractions(createdSession.map, latest.current);
      setSession(createdSession);
      latest.current.onReady?.(createdSession.map);
    });
    return () => {
      cancelled = true;
      teardown.schedule();
    };
  }, []);

  // zoom/center 的同步：初始值由 createMapSession 吸收，就绪后变更直发 SDK
  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);
  useEffect(() => {
    // 此时 SDK 必已加载完成（map 就绪是 loadTdt 之后的信号）
    if (session && center) {
      session.setCenter(center);
    }
  }, [session, center]);

  useImperativeHandle(
    ref,
    () => ({
      get map() {
        return session?.map;
      },
      get session() {
        return session;
      },
      get ready() {
        return session !== undefined;
      },
    }),
    [session],
  );

  const context = useMemo<MapContextValue>(() => ({ map, ready }), [map, ready]);

  return (
    // isolation 创建独立的 stacking context：SDK 内部控件层的高 z-index
    // 不会逃逸出地图容器，避免盖住宿主页面叠加的元素
    <div
      ref={elRef}
      className={props.className}
      style={{ width: "100%", height: "100%", isolation: "isolate", ...props.style }}
    >
      <MapContext.Provider value={context}>{children}</MapContext.Provider>
    </div>
  );
});
