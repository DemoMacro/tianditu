/**
 * 天地图事件对象的事件桥：包装 addEventListener/removeEventListener，
 * 记录全部监听器以便随会话销毁统一移除。
 */

export interface EventTargetLike<E> {
  addEventListener<K extends keyof E>(event: K, handler: E[K]): void;
  removeEventListener<K extends keyof E>(event: K, handler: E[K]): void;
}

export class EventBridge<E> {
  private readonly listeners: Array<[keyof E, E[keyof E]]> = [];

  constructor(private readonly target: EventTargetLike<E>) {}

  /** 注册监听器，返回解绑函数 */
  on<K extends keyof E>(event: K, handler: E[K]): () => void {
    this.target.addEventListener(event, handler);
    this.listeners.push([event, handler]);
    return () => this.off(event, handler);
  }

  off<K extends keyof E>(event: K, handler: E[K]): void {
    this.target.removeEventListener(event, handler);
    const index = this.listeners.findIndex(([e, h]) => e === event && h === handler);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /** 移除全部经由本桥注册的监听器 */
  destroy(): void {
    for (const [event, handler] of this.listeners.splice(0)) {
      this.target.removeEventListener(event, handler);
    }
  }
}

/**
 * 以宽松事件签名挂接命名事件集。SDK 侧（Mousetool/TileLayer 等）的事件
 * 方法为泛型签名（keyof E），跨实体统一挂接时按宽签名收口；
 * 目标缺少事件 API 时静默跳过。
 */
export function bindEventNames(
  target: unknown,
  names: readonly string[],
  dispatch: (name: string, event: unknown) => void,
): () => void {
  const bridge = target as {
    addEventListener?(event: string, handler: (e: unknown) => void): void;
    removeEventListener?(event: string, handler: (e: unknown) => void): void;
  };
  const listeners: Array<[string, (e: unknown) => void]> = [];
  for (const name of names) {
    const handler = (event: unknown) => dispatch(name, event);
    bridge.addEventListener?.(name, handler);
    listeners.push([name, handler]);
  }
  return () => {
    for (const [name, handler] of listeners.splice(0)) {
      bridge.removeEventListener?.(name, handler);
    }
  };
}
