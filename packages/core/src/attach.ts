/**
 * 覆盖物/图层/控件的挂载协议。
 *
 * 天地图各实体的挂载方式并不一致（覆盖物走 addOverLay、点聚合在构造时绑定
 * map、信息窗挂在父覆盖物上），因此协议只约定 create/destroy 两个动作，
 * 具体挂载与卸载由调用方在回调中实现。
 */

export interface AttachContext {
  map: T.Map;
}

export interface Attachable<O> {
  create(context: AttachContext): O;
  destroy(instance: O): void;
}

export function createAttachable<O>(
  create: (context: AttachContext) => O,
  destroy: (instance: O) => void,
): Attachable<O> {
  return { create, destroy };
}
