import { useSdkInstance } from "../useSdkInstance";

/**
 * 本地城市定位（官方 LocalCity）：根据用户 IP 自动定位到城市，构造
 * 无参、不依赖地图实例，经地图上下文等待 SDK 就绪后构造。
 */
export function useLocalCity() {
  const localCity = useSdkInstance(() => new T.LocalCity());

  /** 获取城市信息（lnglat 城市中心点、level 最佳级别、cityName 城市名称） */
  function location(): Promise<T.LocalCityResult | null> {
    return new Promise((resolve) => {
      if (!localCity) {
        resolve(null);
        return;
      }
      localCity.location((result) => resolve(result));
    });
  }

  return { localCity, location };
}
