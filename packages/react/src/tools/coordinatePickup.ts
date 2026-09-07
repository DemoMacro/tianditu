import { createWhenReady } from "@tianditu/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { useMap } from "../context";
import { useDelayedTeardown } from "../useDelayedTeardown";

export interface CoordinatePickupProps {
  /** 受控开关：true 开启拾取，false 关闭 */
  active?: boolean;
  /** 拾取回调：SDK 点击地图即调用（官方 Options.callback，未设置时点击会抛错） */
  onPick?: (lnglat: T.LngLat) => void;
}

export interface CoordinatePickupRef {
  readonly tool: T.CoordinatePickup | undefined;
}

/**
 * 坐标拾取组件（官方 CoordinatePickup）：非 Mousetool 体系，以
 * addEvent/removeEvent 开关；官方 Options.callback 转写为 onPick 回调。
 */
export const TdtCoordinatePickup = forwardRef<CoordinatePickupRef, CoordinatePickupProps>(
  function TdtCoordinatePickup(props, ref) {
    const { map } = useMap();
    const latest = useRef(props);
    latest.current = props;
    const pickupRef = useRef<T.CoordinatePickup | undefined>(undefined);

    // 拾取关闭延迟一拍：StrictMode 立即重挂时取消，真实卸载时执行
    const teardown = useDelayedTeardown(() => {
      pickupRef.current?.removeEvent();
      pickupRef.current = undefined;
    });

    useEffect(() => {
      if (!map) {
        return;
      }
      // 重挂复用已有实例（StrictMode 双挂载视为同一次使用）
      teardown.cancel();
      if (pickupRef.current) {
        return;
      }
      let disposed = false;
      void createWhenReady(
        () =>
          new T.CoordinatePickup(map, {
            callback: (lnglat) => latest.current.onPick?.(lnglat),
          }),
      ).then((created) => {
        if (disposed || !map || pickupRef.current) {
          return;
        }
        pickupRef.current = created;
        if (latest.current.active) {
          created.addEvent();
        }
      });
      return () => {
        disposed = true;
        teardown.schedule();
      };
    }, [map]);

    useEffect(() => {
      const tool = pickupRef.current;
      if (!tool) {
        return;
      }
      if (props.active) {
        tool.addEvent();
      } else {
        tool.removeEvent();
      }
    }, [props.active]);

    useImperativeHandle(
      ref,
      () => ({
        get tool() {
          return pickupRef.current;
        },
      }),
      [],
    );
    return null;
  },
);
