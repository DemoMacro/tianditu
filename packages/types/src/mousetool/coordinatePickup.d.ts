declare namespace T {
  /**
   * 用来实现在地图上用鼠标获取地理坐标的功能
   */
  class CoordinatePickup {
    /**
     * 创建一个坐标拾取组件
     * @param map 地图对象
     * @param opts 配置项
     */
    constructor(map: Map, opts: CoordinatePickupOptions);
    /** 开启鼠标点击地图时获取地理坐标的事件 */
    addEvent(): void;
    /** 关闭鼠标点击地图时获取地理坐标的事件 */
    removeEvent(): void;
  }

  interface CoordinatePickupOptions {
    /**
     * 坐标显示控件停靠位置
     */
    anchor?: ControlPosition;
  }
}
