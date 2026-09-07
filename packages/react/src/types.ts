/**
 * 事件回调 props 类型：由 def.events 的事件名字面量映射为 onXxx 签名。
 * def.events 声明为 readonly string[] 时退化为 `on${string}` 宽松索引，
 * 与 vue 适配层 emits 的声明精度一致。
 */

/** SDK 事件回调的宽松 payload 形态：SDK 事件 payload 随组件而异，对齐 vue 适配层 emit 的宽松语义 */
// biome-ignore lint/suspicious/noExplicitAny: 同上一行说明
export type TdtEventHandler = (event: any) => void;

export type EventHandlers<E extends readonly string[] | undefined> = E extends readonly string[]
  ? {
      [K in E[number] as `on${Capitalize<K & string>}`]?: TdtEventHandler;
    }
  : {};
