import { createWhenReady } from "@tianditu/core";
import { useEffect, useRef, useState } from "react";

import { useMap } from "./context";

/**
 * map 就绪后守卫构造 SDK 实例并缓存：SDK 扩展组件包异步加载且无整体
 * 就绪回调，构造过早会抛 "is not a constructor"，经 createWhenReady
 * 重试。construct 仅在 map 就绪时调用一次（options 变更不重建，与
 * vue 适配层的 useMapInstance 缓存语义一致）。
 */
export function useSdkInstance<T>(construct: (map: T.Map) => T): T | undefined {
  const { map } = useMap();
  const latest = useRef(construct);
  latest.current = construct;
  // 构造 promise 经 ref 复用：StrictMode 双挂载共享同一次构造，
  // 不重复 new（服务实例可能已在 map 上挂监听，孤儿实例会泄漏）
  const pendingRef = useRef<Promise<T> | undefined>(undefined);
  const [instance, setInstance] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!map) {
      return;
    }
    let cancelled = false;
    pendingRef.current ??= createWhenReady(() => latest.current(map));
    void pendingRef.current.then((created) => {
      if (!cancelled) {
        setInstance(created);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [map]);

  return instance;
}
