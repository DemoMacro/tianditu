import { useSdkInstance } from "../useSdkInstance";

/**
 * 浏览器定位（官方 Geolocation）：getCurrentPosition 的回调转写为
 * Promise，失败时 resolve null（官方语义）。
 */
export function useGeolocation() {
  const geolocation = useSdkInstance(() => new T.Geolocation());

  function getCurrentPosition(options?: T.GeolocationOptions): Promise<T.GeolocationResult | null> {
    return new Promise((resolve) => {
      if (!geolocation) {
        resolve(null);
        return;
      }
      geolocation.getCurrentPosition((result) => resolve(result), options);
    });
  }

  return { geolocation, getCurrentPosition };
}
