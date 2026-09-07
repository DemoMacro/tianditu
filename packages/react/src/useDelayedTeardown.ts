import { useMemo, useRef } from "react";

/**
 * StrictMode 双挂载安全的异步资源销毁。React 18+ 的 StrictMode 会在同一
 * 组件实例上执行 "挂载 → 卸载 → 重挂"，异步创建的地图会话/覆盖物若在
 * cleanup 里立即销毁，落定顺序交错时会清掉后一轮刚建好的 DOM（同一容器
 * 复用）。cleanup 只把销毁安排到下一宏任务：立即重挂则取消，真实卸载才
 * 执行。
 */
export function useDelayedTeardown(teardown: () => void): {
  /** effect 重新执行时调用：取消上一轮安排的销毁 */
  cancel: () => void;
  /** cleanup 里调用：安排延迟销毁 */
  schedule: () => void;
} {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const teardownRef = useRef(teardown);
  teardownRef.current = teardown;
  return useMemo(
    () => ({
      cancel: () => clearTimeout(timerRef.current),
      schedule: () => {
        timerRef.current = setTimeout(() => teardownRef.current(), 0);
      },
    }),
    [],
  );
}
