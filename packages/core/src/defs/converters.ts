/**
 * WC attribute 字符串的解析器，供 defs 的 PropDef.converter 声明。
 * 分隔约定：坐标 "lng,lat"，坐标集合用 ";" 分段。
 */

export function parseLnglat(value: string): [number, number] {
  const [lng, lat] = value.split(",").map(Number);
  return [lng, lat];
}

export function parsePath(value: string): Array<[number, number]> {
  return value
    .split(";")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map(parseLnglat);
}

/** "swLng,swLat;neLng,neLat" → [[swLng, swLat], [neLng, neLat]] */
export function parseBounds(value: string): [[number, number], [number, number]] {
  const [sw, ne] = value.split(";").map(parseLnglat);
  return [sw, ne];
}

/** "w,h" → [width, height] */
export function parseSize(value: string): [number, number] {
  const [w, h] = value.split(",").map(Number);
  return [w, h];
}

export function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}
