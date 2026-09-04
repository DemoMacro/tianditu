declare namespace T {
  /**
   * 浏览器定位
   */
  class Geolocation {
    /** 创建一个浏览器定位实例 */
    constructor();
    /**
     * 发起一次当前定位
     * @param callback 定位完成回调；定位失败时参数为 null
     * @param options 定位配置项
     */
    getCurrentPosition(
      callback: (result: GeolocationResult | null) => void,
      options?: GeolocationOptions,
    ): void;
  }

  interface GeolocationOptions {
    /** 是否使用高精度 */
    enableHighAccuracy?: boolean;
    /** 超时时间，单位毫秒 */
    timeout?: number;
  }

  /**
   * 定位结果
   */
  interface GeolocationResult {
    /** 定位坐标 */
    lnglat: LngLat;
  }
}
