declare namespace T {
  /** 此类用于获取用户所在的城市位置信息（根据用户 IP 自动定位到城市） */
  class LocalCity {
    /** 创建一个获取本地城市位置的实例 */
    constructor();

    /** 获取城市信息后调用回调，参数为 LocalCityResult */
    location(callback: (result: LocalCityResult) => void): void;
  }

  /** LocalCity 的定位结果 */
  interface LocalCityResult {
    /** 城市所在中心点 */
    lnglat: LngLat;
    /** 展示当前城市的最佳地图级别（提供 map 实例时按地图大小调整） */
    level: number;
    /** 城市名称 */
    cityName: string;
  }
}
