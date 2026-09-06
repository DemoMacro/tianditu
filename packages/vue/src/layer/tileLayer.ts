import {
  TILE_LAYER_EVENT_NAMES,
  compact,
  createPropsSync,
  mountTileLayer,
  type SyncDef,
} from "@tianditu/core";
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  shallowRef,
  watch,
  type ComponentObjectPropsOptions,
  type PropType,
} from "vue";

import { MAP_KEY } from "../context";

export interface TileLayerProps {
  /** 瓦片服务 URL 模板 */
  url: string;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
  zIndex?: number;
  /** 瓦片加载失败时显示的图片 URL */
  errorTileUrl?: string;
  /** 图层显示范围（官方 TileLayerOptions.bounds） */
  bounds?: [[number, number], [number, number]] | T.LngLatBounds;
}

function tileLayerProps() {
  return {
    url: { type: String, required: true },
    minZoom: { type: Number, default: undefined },
    maxZoom: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    zIndex: { type: Number, default: undefined },
    errorTileUrl: { type: String, default: undefined },
    bounds: { type: Array as unknown as PropType<TileLayerProps["bounds"]>, default: undefined },
  };
}

function toBoundsProp(value: TileLayerProps["bounds"]): T.LngLatBounds | undefined {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}

const tileLayerSync: SyncDef<T.TileLayer, TileLayerProps> = {
  opacity: (layer, value) => layer.setOpacity(value ?? 1),
  zIndex: (layer, value) => layer.setZIndex(value ?? 0),
  url: (layer, value) => layer.setUrl(value),
};

/**
 * 瓦片图层组件工厂：挂载与事件在 core 的 mountTileLayer，
 * url/opacity/zIndex 响应式同步；minZoom/maxZoom 仅初始化生效（SDK 无 setter）。
 * 官方选项不含这些字段的图层（如 GridlineLayer）以 sync 整体替换内置同步表。
 */
export function createTileLayerComponent<P extends object>(options: {
  name: string;
  /** 运行时 props 定义；静态形状由泛型 P 声明并与其对齐 */
  props: ComponentObjectPropsOptions;
  /** 缺省为全部瓦片图层事件；官方未列的事件（如 GridlineLayer）按文档收窄 */
  events?: readonly string[];
  /** 缺省同步 url/opacity/zIndex；组件 props 与之不符时整体替换 */
  sync?: SyncDef<T.TileLayer, P>;
  create(props: P): T.TileLayer;
}) {
  const sync = (options.sync ?? tileLayerSync) as SyncDef<T.TileLayer, P>;
  return defineComponent({
    name: options.name,
    props: options.props,
    emits: [...(options.events ?? TILE_LAYER_EVENT_NAMES)],
    setup(props, { emit, expose }) {
      const { map } = inject(MAP_KEY)!;
      const layer = shallowRef<T.TileLayer>();
      let unmount: (() => void) | undefined;
      let stopSync: (() => void) | undefined;

      watch(
        map,
        (current) => {
          if (!current || layer.value) {
            return;
          }
          layer.value = options.create(props as unknown as P);
          unmount = mountTileLayer({
            map: current,
            layer: layer.value,
            events: options.events,
            dispatch: (name, event) => emit(name as never, event),
          });
          stopSync = createPropsSync(
            () => layer.value,
            () => props as unknown as P,
            sync,
          );
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        stopSync?.();
        unmount?.();
        stopSync = undefined;
        unmount = undefined;
        layer.value = undefined;
      });

      expose({ layer });
      return () => null;
    },
  });
}

export const TdtTileLayer = createTileLayerComponent<TileLayerProps>({
  name: "TdtTileLayer",
  props: tileLayerProps(),
  create: (props) =>
    new T.TileLayer(
      props.url,
      compact({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        zIndex: props.zIndex,
        errorTileUrl: props.errorTileUrl,
        bounds: toBoundsProp(props.bounds),
      }),
    ),
});

export interface TileLayerWMSProps extends TileLayerProps {
  /** 用","分隔的多个图层列表 */
  layers?: string;
  styles?: string;
  /** 输出图像类型，default: image/jpeg */
  format?: string;
  transparent?: boolean;
  /** 请求服务的版本，default: 1.1.1 */
  version?: string;
  /** 地图投影类型，default: EPSG:900913 */
  srs?: string;
}

export const TdtTileLayerWMS = createTileLayerComponent<TileLayerWMSProps>({
  name: "TdtTileLayerWMS",
  props: {
    ...tileLayerProps(),
    layers: { type: String, default: undefined },
    styles: { type: String, default: undefined },
    format: { type: String, default: undefined },
    transparent: { type: Boolean, default: undefined },
    version: { type: String, default: undefined },
    srs: { type: String, default: undefined },
  },
  create: (props) =>
    new T.TileLayerWMS(
      props.url,
      compact({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        zIndex: props.zIndex,
        layers: props.layers,
        styles: props.styles,
        format: props.format,
        transparent: props.transparent,
        version: props.version,
        srs: props.srs,
      }),
    ),
});

export interface TileLayerTDTProps extends TileLayerProps {
  /** 用来描述图层信息 */
  attribution?: string;
}

export const TdtTileLayerTDT = createTileLayerComponent<TileLayerTDTProps>({
  name: "TdtTileLayerTDT",
  props: {
    ...tileLayerProps(),
    attribution: { type: String, default: undefined },
  },
  create: (props) =>
    new T.TileLayerTDT(
      props.url,
      compact({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
        zIndex: props.zIndex,
        errorTileUrl: props.errorTileUrl,
        bounds: toBoundsProp(props.bounds),
        attribution: props.attribution,
      }),
    ),
});
