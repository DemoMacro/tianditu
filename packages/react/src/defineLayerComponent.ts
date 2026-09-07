import { mountTileLayer, type LayerDef } from "@tianditu/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { useMap } from "./context";
import { dispatchToProps } from "./eventHandlers";
import type { EventHandlers } from "./types";
import { usePropsSync } from "./usePropsSync";

/** 经 ref 暴露的 SDK 图层句柄（对齐 vue 适配层 expose({ layer })） */
export interface TdtLayerRef {
  /** SDK 图层实例；就绪前为 undefined */
  readonly layer: T.TileLayer | undefined;
}

/**
 * 瓦片图层组件工厂：消费 core 的框架无关定义（LayerDef），此处只剩
 * map 就绪 → 构造 → mountTileLayer 上屏与事件 → diff 同步的胶水。
 * minZoom/maxZoom 仅初始化生效（SDK 无 setter），不进 sync。
 */
export function defineLayerComponent<P extends object>(def: LayerDef<P>) {
  type Props = P & EventHandlers<typeof def.events>;

  const LayerComponent = forwardRef<TdtLayerRef, Props>(function LayerComponent(props, ref) {
    const { map } = useMap();
    const latest = useRef(props);
    latest.current = props;
    const layerRef = useRef<T.TileLayer | undefined>(undefined);

    useEffect(() => {
      if (!map) {
        return;
      }
      const layer = def.create(latest.current as unknown as P);
      layerRef.current = layer;
      const unmount = mountTileLayer({
        map,
        layer,
        events: def.events,
        dispatch: (name, event) => dispatchToProps(latest.current, name, event),
      });
      return () => {
        unmount();
        layerRef.current = undefined;
      };
    }, [map]);

    usePropsSync(layerRef, def.sync, latest.current as unknown as P);

    useImperativeHandle(
      ref,
      () => ({
        get layer() {
          return layerRef.current;
        },
      }),
      [],
    );
    return null;
  });
  LayerComponent.displayName = def.name;
  return LayerComponent;
}
