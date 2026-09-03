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
