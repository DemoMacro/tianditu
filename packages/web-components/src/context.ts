import type { OverlayCollector } from "@tianditu/core";

import type { TdtMapElement } from "./tdt-map";

/**
 * WC 元素间上下文解析：Vue 适配层用 inject/provide 表达的「地图容器、
 * 覆盖物收集容器、覆盖物宿主」关系，这里以 DOM 结构（closest）表达。
 * 容器能力由元素工厂（makeOverlayElement 的 collector 选项）产出。
 */

/** 暴露 SDK 实例就绪 promise 的元素（覆盖物/容器元素通有） */
export interface InstanceHost<O = unknown> {
  whenInstance(): Promise<O>;
}

/** 覆盖物收集容器（MarkerClusterer/LayerGroup） */
export interface CollectorHost<O = unknown> extends InstanceHost<O> {
  collectorFor(instance: O): OverlayCollector;
}

/** SDK 事件 → `tdt-<name>` CustomEvent（detail 为原生事件对象） */
export function dispatchTdtEvent(el: HTMLElement): (name: string, event: unknown) => void {
  return (name, event) => {
    el.dispatchEvent(
      new CustomEvent(`tdt-${name}`, { detail: event, bubbles: true, composed: true }),
    );
  };
}

/** 就近查找地图容器 */
export function findMap(el: HTMLElement): TdtMapElement | null {
  return el.closest<TdtMapElement>("tdt-map");
}

/**
 * 就近解析覆盖物收集容器：layer-group 优先于 marker-clusterer
 * （与 Vue 适配层的「内层容器就近收编」一致）。无容器时 undefined。
 */
export function resolveCollector(el: HTMLElement): Promise<OverlayCollector | undefined> {
  const source: HTMLElement | null =
    el.closest("tdt-layer-group") ?? el.closest("tdt-marker-clusterer");
  if (!source) {
    return Promise.resolve(undefined);
  }
  // 父元素尚未升级（脚本加载次序）时等 define 完成再取实例
  return customElements.whenDefined(source.localName).then(async () => {
    const host = source as HTMLElement & CollectorHost;
    const instance = await host.whenInstance();
    return host.collectorFor(instance);
  });
}

/** 向上查找最近的覆盖物宿主（InfoWindow 嵌套在覆盖物元素内时由宿主打开） */
export function resolveHostOverlay(el: HTMLElement): Promise<unknown | undefined> {
  let current = el.parentElement;
  while (current) {
    if (typeof (current as HTMLElement & InstanceHost).whenInstance === "function") {
      const host = current as HTMLElement & InstanceHost;
      return customElements.whenDefined(host.localName).then(() => host.whenInstance());
    }
    current = current.parentElement;
  }
  return Promise.resolve(undefined);
}
