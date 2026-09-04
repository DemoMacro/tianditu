import { inject, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";

/**
 * 浏览器定位（官方 Geolocation）：getCurrentPosition 的回调转写为 Promise，
 * 失败时 resolve null（官方语义）。
 */
export function useGeolocation() {
  const { map } = inject(MAP_KEY)!;
  const geolocation = shallowRef<T.Geolocation>();

  watch(
    map,
    (current) => {
      if (current && !geolocation.value) {
        geolocation.value = new T.Geolocation();
      }
    },
    { immediate: true },
  );

  function getCurrentPosition(options?: T.GeolocationOptions): Promise<T.GeolocationResult | null> {
    return new Promise((resolve) => {
      if (!geolocation.value) {
        resolve(null);
        return;
      }
      geolocation.value.getCurrentPosition((result) => resolve(result), options);
    });
  }

  return { geolocation, getCurrentPosition };
}
