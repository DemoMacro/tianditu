import {
  createWhenReady,
  mountOverlay,
  mountTileLayer,
  mountTool,
  type ControlDef,
  type LayerDef,
  type OverlayCollector,
  type OverlayDef,
  type OverlayHandle,
  type PropDef,
  type PropDefs,
  type SyncDef,
  type ToolDef,
  type ToolSession,
} from "@tianditu/core";
import { LitElement, html, type PropertyValues } from "lit";

import { dispatchTdtEvent, findMap, resolveCollector } from "./context";

/**
 * WC 元素工厂：消费 core 的框架无关定义，把「attribute 声明、默认值、
 * 容器解析、生命周期桥接」收敛在一处。与 vue 适配层一样，定义中的
 * props/构造/sync/事件表只有一份，工厂自身不含任何 SDK 知识。
 *
 * attribute 约定：Boolean 用 presence 语义（存在即 true，框架绑定走
 * property）；坐标/集合用逗号、分号分隔；纯数据对象用 JSON；SDK 实例
 * 为 JS-only property（def 里无 attribute 名）。
 */

type LitPropertyDefinition = Record<string, unknown>;
type LitProperties = Record<string, LitPropertyDefinition>;

/** defs 中立 props → lit reactive properties */
function litProperties<P extends object>(props: PropDefs<P>): LitProperties {
  const out: LitProperties = {};
  for (const key in props) {
    const def: PropDef = props[key];
    if (!def.attribute) {
      // JS-only property：SDK 实例等不可序列化值，不走 attribute
      out[key] = { type: Object, attribute: false };
      continue;
    }
    out[key] = {
      type: def.type ?? Object,
      attribute: def.attribute,
      ...(def.converter
        ? {
            converter: (value: string | null) =>
              value == null ? undefined : def.converter!(value),
          }
        : {}),
      ...(def.reflect ? { reflect: true } : {}),
    };
  }
  return out;
}

/** 从元素自身的 property 值收集 defs 形状的 props */
function collectProps<P extends object>(el: LitElement, props: PropDefs<P>): P {
  const out: Record<string, unknown> = {};
  for (const key in props) {
    out[key] = (el as unknown as Record<string, unknown>)[key];
  }
  return out as P;
}

/** 构造期默认值落位：attribute 未提供时 defs 的 default 生效 */
function applyDefaults<P extends object>(el: LitElement, props: PropDefs<P>): void {
  for (const key in props) {
    const { default: fallback } = props[key];
    if (fallback !== undefined) {
      (el as unknown as Record<string, unknown>)[key] =
        typeof fallback === "function" ? (fallback as () => unknown)() : fallback;
    }
  }
}

/**
 * lit property 变更 diff → sync setter。lit 无响应式追踪（core 的
 * createPropsSync 面向响应式 getter，仅 vue 适配层使用），在 updated
 * 里手动驱动：变更的 key 即 diff 结果，旧值取 lit 记录的上一帧。
 */
function applySyncDiff<O, P extends object>(
  instance: O,
  sync: SyncDef<O, P>,
  changed: PropertyValues,
  props: P,
): void {
  for (const [key, prev] of changed) {
    const apply = (sync as Record<string, (t: O, v: unknown, p: unknown) => void>)[
      key as string
    ];
    if (apply) {
      apply(instance, props[key as keyof P], prev);
    }
  }
}

export interface OverlayElementOptions<O> {
  /** 声明后本元素成为覆盖物收集容器，子级覆盖物经 DOM 就近收编 */
  collector?: (instance: O) => OverlayCollector;
}

/** 覆盖物元素类（具名类型：d.ts 不展开工厂内的匿名类实现） */
export interface OverlayElementClass<O> {
  new (): LitElement & {
    /** SDK 实例就绪 promise（容器收编子级、InfoWindow 宿主等待） */
    whenInstance(): Promise<O>;
    /** 当前 SDK 实例；未挂载时 undefined */
    readonly instance: O | undefined;
    /** 收集容器时把实例适配为 OverlayCollector */
    collectorFor(instance: O): OverlayCollector;
  };
}

/** 工具元素类（具名类型） */
export interface ToolElementClass {
  new (): LitElement & {
    /** 受控开关：attribute 存在即开启 */
    active: boolean;
    /** SDK 工具实例就绪 promise */
    whenInstance(): Promise<unknown>;
  };
}

/**
 * 覆盖物元素工厂。生命周期与 vue 的 defineOverlayComponent 同构：
 * createWhenReady 守卫构造（SDK 扩展类异步加载）→ 解析收集容器 →
 * mountOverlay 编排挂载/同步/事件 → 卸载清理。
 */
export function makeOverlayElement<P extends object, O>(
  def: OverlayDef<P, O>,
  options?: OverlayElementOptions<O>,
): OverlayElementClass<O> {
  class OverlayElement extends LitElement {
    static override properties = litProperties(def.props);

    private handle?: OverlayHandle<O>;

    private resolveInstance?: (value: O) => void;

    private whenInstancePromise?: Promise<O>;

    constructor() {
      super();
      applyDefaults(this, def.props);
    }

    /** SDK 实例就绪 promise（容器收编子级、InfoWindow 宿主等待） */
    whenInstance(): Promise<O> {
      return (this.whenInstancePromise ??= new Promise(
        (resolve) => (this.resolveInstance = resolve),
      ));
    }

    /** 当前 SDK 实例；未挂载时 undefined */
    get instance(): O | undefined {
      return this.handle?.instance;
    }

    collectorFor(instance: O): OverlayCollector {
      if (!options?.collector) {
        throw new Error(`<${def.tag}> 不是覆盖物收集容器`);
      }
      return options.collector(instance);
    }

    protected props(): P {
      return collectProps(this, def.props);
    }

    override connectedCallback(): void {
      super.connectedCallback();
      const container = findMap(this);
      if (!container) {
        return;
      }
      // 构造与收集容器解析并行等待；createWhenReady 守卫 SDK 扩展类加载
      void Promise.all([
        container
          .whenReady()
          .then((map) => createWhenReady(() => def.create(this.props(), { map }))),
        resolveCollector(this),
      ]).then(([created, collector]) => {
        const map = container.map;
        if (!map || this.handle || !this.isConnected) {
          return;
        }
        this.handle = mountOverlay(
          { map, collector },
          {
            props: () => this.props(),
            // sync 由 updated 的 lit diff 驱动，不走 core 的响应式引擎
            events: def.events,
            dispatch: dispatchTdtEvent(this),
            create: () => created,
            // 包裹调用：避免 unbound-method 引用（def 钩子可选方法）
            attach: def.attach ? (target, ctx) => def.attach!(target, ctx) : undefined,
            detach: def.detach ? (target, ctx) => def.detach!(target, ctx) : undefined,
          },
        );
        this.resolveInstance?.(this.handle.instance);
      });
    }

    override updated(changed: PropertyValues): void {
      if (!this.handle || !def.sync || changed.size === 0) {
        return;
      }
      applySyncDiff(this.handle.instance, def.sync, changed, this.props());
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.handle?.destroy();
      this.handle = undefined;
    }

    override render() {
      // light DOM 渲染：使用者的子元素保持原样
      return html``;
    }
  }

  return OverlayElement;
}

/**
 * 鼠标工具元素工厂。受控 active attribute（presence 语义 + reflect）驱动
 * mountTool 的开关；attribute 变化在 updated 统一应用——session 未就绪时
 * 由落定回调读取当前值，最后写入胜出。
 */
export function makeToolElement<P extends object>(def: ToolDef<P>): ToolElementClass {
  class ToolElement extends LitElement {
    static override properties = {
      active: { type: Boolean, reflect: true },
      ...litProperties(def.props),
    };

    /** 受控开关：attribute 存在即开启 */
    active = false;

    private session?: ToolSession;

    private resolveTool?: (value: unknown) => void;

    private whenToolPromise?: Promise<unknown>;

    /** SDK 工具实例就绪 promise */
    whenInstance(): Promise<unknown> {
      return (this.whenToolPromise ??= new Promise((resolve) => (this.resolveTool = resolve)));
    }

    protected props(): P {
      return collectProps(this, def.props);
    }

    override connectedCallback(): void {
      super.connectedCallback();
      const container = findMap(this);
      if (!container) {
        return;
      }
      void container
        .whenReady()
        .then((map) => createWhenReady(() => def.create(this.props(), map)))
        .then((created) => {
          if (this.session || !this.isConnected) {
            return;
          }
          this.session = mountTool({
            map: container.map!,
            create: () => created,
            events: def.events,
            dispatch: dispatchTdtEvent(this),
            activate: def.activate ? (tool) => def.activate!(tool) : undefined,
            deactivate: def.deactivate ? (tool) => def.deactivate!(tool) : undefined,
          });
          this.resolveTool?.(this.session.tool);
          this.session.setActive(this.active);
        });
    }

    override updated(changed: PropertyValues): void {
      if (changed.has("active")) {
        this.session?.setActive(this.active);
      }
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.session?.destroy();
      this.session = undefined;
    }

    override render() {
      return html``;
    }
  }

  return ToolElement;
}

/** 控件元素类（具名类型） */
export interface ControlElementClass {
  new (): LitElement & {
    /** 当前 SDK 控件实例；未挂载时 undefined */
    readonly instance: T.Control | undefined;
  };
}

/**
 * 控件元素工厂：attribute → SDK 控件构造并 addControl，卸载 removeControl。
 * 与 vue 的 defineControlComponent 同构：构造经 createWhenReady 守卫。
 */
export function makeControlElement<P extends object>(def: ControlDef<P>): ControlElementClass {
  class ControlElement extends LitElement {
    static override properties = litProperties(def.props);

    private control?: T.Control;

    constructor() {
      super();
      applyDefaults(this, def.props);
    }

    get instance(): T.Control | undefined {
      return this.control;
    }

    protected props(): P {
      return collectProps(this, def.props);
    }

    override connectedCallback(): void {
      super.connectedCallback();
      const container = findMap(this);
      if (!container) {
        return;
      }
      // 守卫等待期间元素可能已卸载，落定时不得再挂载
      void container
        .whenReady()
        .then((map) =>
          createWhenReady(() => def.create(this.props())).then((control) => {
            if (this.control || !this.isConnected) {
              return;
            }
            this.control = control;
            map.addControl(control);
          }),
        )
        .catch(() => {});
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      const map = findMap(this)?.map;
      if (this.control && map) {
        map.removeControl(this.control);
      }
      this.control = undefined;
    }

    override render() {
      return html``;
    }
  }

  return ControlElement;
}

/** 图层元素类（具名类型） */
export interface LayerElementClass {
  new (): LitElement & {
    /** SDK 图层实例就绪 promise */
    whenInstance(): Promise<T.TileLayer>;
    /** 当前 SDK 图层实例；未挂载时 undefined */
    readonly instance: T.TileLayer | undefined;
  };
}

/**
 * 瓦片图层元素工厂：create → mountTileLayer 上屏与事件；props 变更在
 * updated 里 diff 应用 sync（defs 缺省为 url/opacity/zIndex 同步表）。
 */
export function makeLayerElement<P extends object>(def: LayerDef<P>): LayerElementClass {
  class LayerElement extends LitElement {
    static override properties = litProperties(def.props);

    private unmount?: () => void;

    private layer?: T.TileLayer;

    private resolveInstance?: (value: T.TileLayer) => void;

    private whenInstancePromise?: Promise<T.TileLayer>;

    constructor() {
      super();
      applyDefaults(this, def.props);
    }

    whenInstance(): Promise<T.TileLayer> {
      return (this.whenInstancePromise ??= new Promise(
        (resolve) => (this.resolveInstance = resolve),
      ));
    }

    get instance(): T.TileLayer | undefined {
      return this.layer;
    }

    protected props(): P {
      return collectProps(this, def.props);
    }

    override connectedCallback(): void {
      super.connectedCallback();
      const container = findMap(this);
      if (!container) {
        return;
      }
      void container
        .whenReady()
        .then((map) =>
          createWhenReady(() => def.create(this.props())).then((layer) => {
            if (this.layer || !this.isConnected) {
              return;
            }
            this.layer = layer;
            this.unmount = mountTileLayer({
              map,
              layer,
              events: def.events,
              dispatch: dispatchTdtEvent(this),
            });
            this.resolveInstance?.(layer);
          }),
        )
        .catch(() => {});
    }

    override updated(changed: PropertyValues): void {
      if (!this.layer || !def.sync || changed.size === 0) {
        return;
      }
      applySyncDiff(this.layer, def.sync, changed, this.props());
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.unmount?.();
      this.unmount = undefined;
      this.layer = undefined;
    }

    override render() {
      return html``;
    }
  }

  return LayerElement;
}
