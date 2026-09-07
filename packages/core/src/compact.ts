/**
 * SDK 构造参数对显式 undefined 与字段默认不等价（如控件 options 携带
 * position: undefined 时 addControl 直接报错），构造前统一剔除。
 */
export function compact<T extends object>(options: T): T {
  return Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined),
  ) as T;
}
