/**
 * 车辆轨迹（CarTrack）的构造编排。SDK 的 passOneNode 为构造回调，
 * 此处转写为统一的 dispatch 形态；播放控制经 session 暴露。
 */

import { toLngLat } from "./session";

export interface CarTrackSpec {
  /** 轨迹节点坐标序列，仅初始化生效（SDK 无动态更新 API） */
  datas?: Array<[number, number] | T.LngLat>;
  /** 节点间移动的时间间隔，单位毫秒 */
  interval?: number;
  /** 每个时间间隔移动的距离，单位米；为 0 时按节点坐标逐点移动 */
  speed?: number;
  /** 轨迹线是否随车动态绘制 */
  dynamicLine?: boolean;
  /** 车辆样式 */
  carstyle?: {
    display: boolean;
    iconUrl: string;
    width: number;
    height: number;
  };
  /** 轨迹线样式 */
  polylinestyle?: {
    display: boolean;
    color: string;
    width: number;
    opacity: number;
  };
}

export interface CarTrackSession {
  readonly carTrack: T.CarTrack;
  start(): void;
  stop(): void;
  pause(): void;
  /** 清空轨迹并移除车辆（不可逆，组件卸载时调用） */
  destroy(): void;
}

export function mountCarTrack(
  map: T.Map,
  spec: CarTrackSpec,
  onPassOneNode?: (lnglat: T.LngLat, index: number, length: number) => void,
): CarTrackSession {
  const carTrack = new T.CarTrack(map, {
    interval: spec.interval,
    speed: spec.speed,
    dynamicLine: spec.dynamicLine,
    Datas: spec.datas?.map((item) => toLngLat(item)),
    carstyle: spec.carstyle,
    polylinestyle: spec.polylinestyle,
    passOneNode: onPassOneNode,
  });
  return {
    carTrack,
    start: () => carTrack.start(),
    stop: () => carTrack.stop(),
    pause: () => carTrack.pause(),
    destroy: () => carTrack.clear(),
  };
}
