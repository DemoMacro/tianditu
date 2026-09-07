/**
 * SDK 原生事件 → onXxx 回调 props 的运行时派发。def.events 只声明事件名
 * 字符串，回调以 SDK 原生事件对象为参（类型映射见 types.ts）。
 */

/** SDK 原生事件名 → onXxx 回调 props 名 */
export function eventPropName(name: string): string {
  return `on${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

/** 把 SDK 事件派发给 props 上对应的 onXxx 回调（未传时静默跳过） */
export function dispatchToProps(props: unknown, name: string, event: unknown): void {
  const handler = (props as Record<string, unknown>)[eventPropName(name)];
  if (typeof handler === "function") {
    handler(event);
  }
}
