import {
  circleDef,
  cloudMarkerDef,
  labelDef,
  layerGroupDef,
  markerClustererDef,
  markerDef,
  polygonDef,
  polylineDef,
  rectangleDef,
} from "@tianditu/core";

import { makeOverlayElement } from "./factory";

/**
 * 覆盖物元素：定义（props/构造/sync/事件表）见 core defs，元素只承载
 * attribute 声明与生命周期桥接。attribute 命名随官方 Options 字段
 * （kebab-case）；坐标 "lng,lat"、集合 "lng,lat;…"、对象 JSON。
 */

export const TdtMarkerElement = makeOverlayElement(markerDef);

export const TdtPolylineElement = makeOverlayElement(polylineDef);

export const TdtPolygonElement = makeOverlayElement(polygonDef);

export const TdtRectangleElement = makeOverlayElement(rectangleDef);

export const TdtLabelElement = makeOverlayElement(labelDef);

export const TdtCircleElement = makeOverlayElement(circleDef);

export const TdtCloudMarkerElement = makeOverlayElement(cloudMarkerDef);

/** 点聚合容器：子级 tdt-marker 经 DOM 就近收编加入聚合而非直接上屏 */
export const TdtMarkerClustererElement = makeOverlayElement(markerClustererDef, {
  collector: (cluster) => ({
    addMarker: (marker) => cluster.addMarker(marker),
    removeMarker: (marker) => cluster.removeMarker(marker),
  }),
});

/** 图层组容器：子级覆盖物加入容器，容器卸载时随 clearLayers 清空 */
export const TdtLayerGroupElement = makeOverlayElement(layerGroupDef, {
  collector: (group) => ({
    addMarker: (marker) => group.addLayer(marker as unknown as T.Overlay),
    removeMarker: (marker) => group.removeLayer(marker as unknown as T.Overlay),
  }),
});
