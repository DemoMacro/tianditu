export {};

declare global {
  namespace T {
    /**
     * 标绘工具的公共接口，由官方各工具页面（ArcTool、StraightArrowTool 等）
     * 的公共成员归纳；官方文档未声明统一基类
     */
    class MilitaryTool<G> {
      /** 开启工具 */
      open(): boolean;
      /** 关闭工具 */
      close(): void;
      /** 清空工具绘制的所有图形 */
      clear(): void;
      /** 获取工具绘制的所有图形 */
      getLayers(): G[];
      /** 添加事件监听函数 */
      addEventListener<E extends keyof MilitaryToolEvents<G>>(
        event: E,
        handler: MilitaryToolEvents<G>[E],
      ): void;
      /** 移除事件监听函数 */
      removeEventListener<E extends keyof MilitaryToolEvents<G>>(
        event: E,
        handler: MilitaryToolEvents<G>[E],
      ): void;
    }

    interface MilitaryToolEvents<G> {
      /** 工具点击一次地图触发的事件 */
      click(e: MilitaryToolEvent<G>): void;
      /** 工具绘制图形时移动鼠标的事件 */
      move(e: MilitaryToolEvent<G>): void;
      /** 双击结束编辑时触发（官方拼写即为 dbclick；部分工具页未列出） */
      dbclick(e: MilitaryToolEvent<G>): void;
    }

    interface MilitaryToolEvent<G> {
      /** 事件类型 */
      type: string;
      /** 工具对象 */
      target: MilitaryTool<G>;
      /** 当前绘制的点数组 */
      currentLnglats: LngLat[];
      /** 当前绘制的图形 */
      currentLayer: G | undefined;
      /** 工具绘制的所有图形 */
      allLayers: G[];
    }

    interface MilitaryToolOptions {
      /**
       * 绘制图形的样式。default {color:"red", weight:5, opacity:0.5}
       * （部分工具额外含 fillColor/fillOpacity/fill）
       */
      style?: MilitaryStyle;
      /** 存储绘制图形的容器，默认时工具创建空图层容器 */
      layers?: LayerGroup;
    }

    interface MilitaryStyle {
      color?: string;
      weight?: number;
      opacity?: number;
      fillColor?: string;
      fillOpacity?: number;
      fill?: boolean;
    }
  }
}
