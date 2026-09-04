import { bindEventNames } from "./events";
import { createPropsSync, type SyncDef } from "./props-sync";

/**
 * 覆盖物的挂载编排。天地图覆盖物有两种去向：直接上屏（map.addOverLay）
 * 或加入点聚合（collector），由挂载上下文表达；MarkerClusterer 等非常规
 * 收尾经 attach/detach 钩子覆盖。
 */

/** 聚合收集器（MarkerClusterer 提供给内部 Marker） */
export interface OverlayCollector {
  addMarker(marker: T.Marker): void;
  removeMarker(marker: T.Marker): void;
}

export interface OverlayMountContext {
  map: T.Map;
  /** 存在时覆盖物加入聚合而非直接上屏 */
  collector?: OverlayCollector;
}

export interface OverlayMountSpec<P extends object, O> {
  /** 响应式 props getter（框架适配层传入） */
  props: () => P;
  /** props diff → 实例 setter */
  sync?: SyncDef<O, P>;
  /** SDK 原生事件名 */
  events?: readonly string[];
  dispatch: (name: string, event: unknown) => void;
  /** 构造实例；上屏由 attach 统一编排 */
  create(ctx: OverlayMountContext): O;
  /** 缺省：有 collector 走 addMarker，否则 addOverLay */
  attach?(instance: O, ctx: OverlayMountContext): void;
  /** 缺省：有 collector 走 removeMarker，否则 removeOverLay */
  detach?(instance: O, ctx: OverlayMountContext): void;
}

export interface OverlayHandle<O> {
  readonly instance: O;
  readonly context: OverlayMountContext;
  /** 停同步、解绑事件并卸载实例 */
  destroy(): void;
}

export function mountOverlay<P extends object, O>(
  ctx: OverlayMountContext,
  spec: OverlayMountSpec<P, O>,
): OverlayHandle<O> {
  const instance = spec.create(ctx);
  const attach = (target: O, mountCtx: OverlayMountContext) =>
    spec.attach ? spec.attach(target, mountCtx) : defaultAttach(target, mountCtx);
  const detach = (target: O, mountCtx: OverlayMountContext) =>
    spec.detach ? spec.detach(target, mountCtx) : defaultDetach(target, mountCtx);

  attach(instance, ctx);
  const unbind = bindEventNames(instance, spec.events ?? [], spec.dispatch);
  const stopSync = spec.sync ? createPropsSync(() => instance, spec.props, spec.sync) : undefined;

  return {
    instance,
    context: ctx,
    destroy() {
      stopSync?.();
      unbind();
      detach(instance, ctx);
    },
  };
}

function defaultAttach<O>(instance: O, ctx: OverlayMountContext): void {
  if (ctx.collector) {
    ctx.collector.addMarker(instance as unknown as T.Marker);
  } else {
    ctx.map.addOverLay(instance as unknown as T.Overlay);
  }
}

function defaultDetach<O>(instance: O, ctx: OverlayMountContext): void {
  if (ctx.collector) {
    ctx.collector.removeMarker(instance as unknown as T.Marker);
  } else {
    ctx.map.removeOverLay(instance as unknown as T.Overlay);
  }
}
