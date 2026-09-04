export {};

declare global {
  namespace T {
    /**
     * 地址解析器。对照官方文档仅列反地址解析能力
     */
    class Geocoder {
      /** 创建一个地址解析器的实例 */
      constructor();
      /**
       * 对指定的坐标点进行反地址解析
       * @param point 坐标点
       * @param callback 解析成功时参数为 GeocoderResult，失败时为 null
       */
      getLocation(point: LngLat, callback: (result: GeocoderResult | null) => void): void;
    }

    /**
     * 反地址解析结果
     */
    interface GeocoderResult {
      /** 解析状态（官方文档返回值拼写即为 numer） */
      getStatus(): number;
      /** 返回响应信息 */
      getMsg(): string;
      /** 获取此点坐标 */
      getLocationPoint(): LngLat;
      /** 获取详细地址 */
      getAddress(): string;
      /** 获取此点的详细信息 */
      getAddressComponent(): AddressComponent;
    }

    /**
     * 地址成分描述
     */
    interface AddressComponent {
      /** 详细地址 */
      address: string;
      /** 热点名称 */
      poi: string;
      /** 距离 */
      distance: number;
    }
  }
}
