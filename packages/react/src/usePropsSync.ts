import type { SyncDef } from "@tianditu/core";
import { useEffect, useRef } from "react";

/**
 * React 版 props→SDK 同步：每次提交后对 sync 表声明的 key 做 Object.is
 * 浅 diff，变更项交给 setter。React 无依赖追踪，不走 core 的响应式引擎
 * （Web Components 适配层同此）。构造已吸收初始 props，首个 effect 前后
 * props 相同、diff 为空，天然跳过首轮全量。
 */
export function usePropsSync<P extends object, O>(
  instanceRef: { readonly current: O | undefined },
  sync: SyncDef<O, P> | undefined,
  props: P,
): void {
  const prev = useRef<P | undefined>(undefined);
  useEffect(() => {
    const before = prev.current;
    prev.current = props;
    const instance = instanceRef.current;
    if (!before || !instance || !sync) {
      return;
    }
    for (const key of Object.keys(sync) as Array<keyof P & string>) {
      if (!Object.is(props[key], before[key])) {
        sync[key]?.(instance, props[key], before[key]);
      }
    }
  });
}
