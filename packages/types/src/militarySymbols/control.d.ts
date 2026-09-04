declare namespace T {
  /**
   * 标绘控件（官方命名 Control.militarySymbols），在地图上加载标绘
   * 工具条
   */
  class ControlMilitarySymbols extends T.Control {
    constructor(opts?: ControlMilitarySymbolsOptions);
    /** 清空控件绘制的图形 */
    clearLayers(): void;
    /** 获取控件绘制的图形（官方返回值标注为 Array<Layer>） */
    getLayers(): Overlay[];
    /** 关闭并清空当前绘制（官方拼写即为大写 Close） */
    Close(): void;
  }

  interface ControlMilitarySymbolsOptions extends ControlOptions {
    /** 控件停靠位置 */
    position?: ControlPosition;
  }
}
