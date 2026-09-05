import { toLngLat } from "@tianditu/core";

import { defineOverlayComponent } from "../defineOverlayComponent";

export interface CloudMarkerProps {
  /** 海量点的坐标集合 */
  lnglats: Array<T.LngLat | [number, number]>;
  /** 绘制样式（官方 CloudMarkerCollectionOptions：ShapeType/SizeType/color） */
  styles?: T.CloudMarkerCollectionOptions;
}

/** 海量点（官方 CloudMarkerCollection）：万级密集点数据的整批展示 */
export const TdtCloudMarker = defineOverlayComponent<CloudMarkerProps, T.CloudMarkerCollection>({
  name: "TdtCloudMarker",
  props: {
    lnglats: { type: Array, required: true },
    styles: { type: Object, default: undefined },
  },
  events: ["click", "mouseover", "mouseout"] as const,
  create: (props) => new T.CloudMarkerCollection(props.lnglats.map(toLngLat), props.styles ?? {}),
  sync: {
    lnglats: (collection, value) => collection.setLnglats(value.map(toLngLat)),
    styles: (collection, value) => {
      if (value) {
        collection.setStyles(value);
      }
    },
  },
});
