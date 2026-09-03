import { effect, stop } from "@vue/reactivity";

/**
 * props-sync 引擎：把响应式 props diff 成命令式 setter 调用。
 * 与具体框架解耦，仅依赖 @vue/reactivity 的 effect（watch 属于
 * runtime-core，这里用 effect 自行实现等效语义），供各框架适配层复用。
 */

export type SyncDef<T, P> = {
  [K in keyof P]?: (target: T, value: P[K], prev: P[K] | undefined) => void;
};

/**
 * 跟踪 target 与 props 两个响应式源：props 变化时按 key 浅比较后调用对应
 * setter；首次执行或 target 就绪（从未就绪变为就绪）时对所有 key 做一次
 * 全量应用。返回 stop 函数，由适配层在卸载时调用。
 */
export function createPropsSync<T, P extends object>(
  target: () => T | undefined,
  props: () => P,
  defs: SyncDef<T, P>,
): () => void {
  let prevTarget: T | undefined;
  let prevProps: P | undefined;

  const runner = effect(() => {
    const nextTarget = target();
    const next = props();

    if (!nextTarget) {
      prevTarget = undefined;
      prevProps = next;
      return;
    }

    // target 首次就绪时全量应用，此后走 diff
    const fullApply = !prevTarget;
    for (const key in defs) {
      const apply = defs[key];
      if (!apply) {
        continue;
      }
      const value = next[key];
      const prev = prevProps?.[key];
      if (fullApply || !Object.is(value, prev)) {
        apply(nextTarget, value, prev);
      }
    }
    prevTarget = nextTarget;
    prevProps = next;
  });

  return () => stop(runner);
}
