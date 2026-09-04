import { toLngLat } from "@tianditu/core";
import { inject, shallowRef, watch } from "vue";

import { MAP_KEY } from "../context";

/**
 * 反地址解析（官方 Geocoder）：构造无参、不依赖地图实例，此处经地图上下文
 * 等待 SDK 就绪后构造；getLocation 的回调转写为 Promise。
 */
export function useGeocoder() {
  const { map } = inject(MAP_KEY)!;
  const geocoder = shallowRef<T.Geocoder>();

  watch(
    map,
    (current) => {
      if (current && !geocoder.value) {
        geocoder.value = new T.Geocoder();
      }
    },
    { immediate: true },
  );

  /** 反地址解析；官方语义：解析成功返回结果，失败返回 null */
  function getLocation(point: T.LngLat | [number, number]): Promise<T.GeocoderResult | null> {
    return new Promise((resolve) => {
      if (!geocoder.value) {
        resolve(null);
        return;
      }
      geocoder.value.getLocation(toLngLat(point), (result) => resolve(result));
    });
  }

  return { geocoder, getLocation };
}
