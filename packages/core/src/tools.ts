/**
 * 地图工具（Mousetool 体系及 CoordinatePickup）的协议与生命周期编排。
 *
 * Mousetool 基类以 open/close 开关并暴露泛型事件签名；CoordinatePickup
 * 以 addEvent/removeEvent 开关且无事件监听，因此协议只约定开关动作，
 * 事件按宽松签名挂接。
 */

import { bindEventNames } from "./events";

/** 工具实例的开关协议 */
export interface ToolLike {
  open?(): unknown;
  close?(): unknown;
  addEvent?(): unknown;
  removeEvent?(): unknown;
}

export interface ToolMountOptions {
  map: T.Map;
  create(): ToolLike;
  /** 需要挂接的 SDK 原生事件名 */
  events?: readonly string[];
  /** 事件分发回调（事件名 + 原生事件对象） */
  dispatch: (name: string, event: unknown) => void;
  /** 缺省调用 tool.open()（Mousetool 语义） */
  activate?(tool: ToolLike): void;
  deactivate?(tool: ToolLike): void;
}

export interface ToolSession {
  readonly tool: ToolLike;
  setActive(active: boolean): void;
  /** 解绑事件并关闭工具；不清除工具已绘制的图形（属于用户数据） */
  destroy(): void;
}

export function mountTool(options: ToolMountOptions): ToolSession {
  const tool = options.create();
  const activate = (current: ToolLike) =>
    options.activate ? options.activate(current) : current.open?.();
  const deactivate = (current: ToolLike) =>
    options.deactivate ? options.deactivate(current) : current.close?.();

  const unbind = bindEventNames(tool, options.events ?? [], options.dispatch);
  // undefined 表示尚未应用过状态，首次 setActive 总是强制执行
  let active: boolean | undefined;

  return {
    tool,
    setActive(value: boolean) {
      if (value === active) {
        return;
      }
      active = value;
      value ? activate(tool) : deactivate(tool);
    },
    destroy() {
      unbind();
      deactivate(tool);
    },
  };
}
