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
} from "vue";

import { MAP_KEY } from "../context";

export interface TileLayerProps {
  /** 瓦片服务 URL 模板 */
  url: string;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
  zIndex?: number;
}

function tileLayerProps() {
  return {
    url: { type: String, required: true },
    minZoom: { type: Number, default: undefined },
    maxZoom: { type: Number, default: undefined },
    opacity: { type: Number, default: undefined },
    zIndex: { type: Number, default: undefined },
  };
}

const tileLayerSync: SyncDef<T.TileLayer, TileLayerProps> = {
  opacity: (layer, value) => layer.setOpacity(value ?? 1),
  zIndex: (layer, value) => layer.setZIndex(value ?? 0),
  url: (layer, value) => layer.setUrl(value),
};

/**
 * 瓦片图层组件工厂：挂载与事件在 core 的 mountTileLayer，
 * url/opacity/zIndex 响应式同步；minZoom/maxZoom 仅初始化生效（SDK 无 setter）。
 */
export function createTileLayerComponent<P extends TileLayerProps>(options: {
  name: string;
  /** 运行时 props 定义；静态形状由泛型 P 声明并与其对齐 */
  props: ComponentObjectPropsOptions;
  create(props: P): T.TileLayer;
}) {
  return defineComponent({
    name: options.name,
    props: options.props,
    emits: [...TILE_LAYER_EVENT_NAMES],
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
            dispatch: (name, event) => emit(name as never, event),
          });
          stopSync = createPropsSync(
            () => layer.value,
            () => props as unknown as P,
            tileLayerSync,
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
