import { toLngLat } from "@tianditu/core";

/** props 中的 [lng, lat] 数组转 SDK LngLat（容忍已传入 LngLat 的情况） */
export function toLngLatProp(value: [number, number] | T.LngLat): T.LngLat {
  return Array.isArray(value) ? toLngLat(value) : value;
}

/** props 中的经纬度数组集合转 SDK LngLat[] */
export function toLngLatsProp(value: Array<[number, number] | T.LngLat>): T.LngLat[] {
  return value.map((item) => toLngLatProp(item));
}
