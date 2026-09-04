declare namespace T {
  /**
   * 右键菜单
   */
  class ContextMenu {
    /** 创建一个右键菜单实例 */
    constructor();
    /** 添加菜单项 */
    addItem(item: MenuItem): void;
    /** 返回指定索引位置的菜单项，第一个菜单项的索引为 0 */
    getItem(index: number): MenuItem;
    /** 移除菜单项 */
    removeItem(item: MenuItem): void;
    /** 添加分隔符 */
    addSeparator(): void;
    /** 移除指定索引位置的分隔符，第一个分隔符的索引为 0 */
    removeSeparator(index: number): void;
    /** 返回所有菜单项 */
    getItems(): MenuItem[];
    /** 返回所有分割线（官方拼写即为 getAllSeparato） */
    getAllSeparato(): unknown[];
    /** 添加事件监听函数 */
    addEventListener<E extends keyof ContextMenuEvents>(
      event: E,
      handler: ContextMenuEvents[E],
    ): void;
    /** 移除事件监听函数 */
    removeEventListener<E extends keyof ContextMenuEvents>(
      event: E,
      handler: ContextMenuEvents[E],
    ): void;
  }

  /**
   * 右键菜单项。菜单项被点击时，以菜单弹出时的地理坐标点为参数调用回调函数
   */
  class MenuItem {
    constructor(text: string, callback: (lnglat: LngLat) => void);
    /** 设置菜单项显示的文本 */
    setText(text: string): void;
    /** 启用菜单项 */
    enable(): void;
    /** 禁用菜单项 */
    disable(): void;
  }

  interface ContextMenuEvent {
    /** 事件类型 */
    type: string;
    /** 菜单对象 */
    target: ContextMenu;
    /** 菜单开启时的像素坐标点 */
    point: Point;
  }

  interface ContextMenuEvents {
    /** 右键菜单打开时触发 */
    open(e: ContextMenuEvent): void;
    /** 右键菜单关闭时触发 */
    close(e: Pick<ContextMenuEvent, "type" | "target">): void;
  }
}
