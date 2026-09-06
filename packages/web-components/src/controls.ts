import { copyrightDef, mapTypeDef, overviewMapDef, scaleDef, zoomDef } from "@tianditu/core";

import { makeControlElement } from "./factory";

/**
 * 控件元素：定义（props/构造）见 core defs，attribute 声明与 addControl/
 * removeControl 生命周期编排已在 factory 的 makeControlElement。
 */

export const TdtControlZoomElement = makeControlElement(zoomDef);

export const TdtControlScaleElement = makeControlElement(scaleDef);

export const TdtControlCopyrightElement = makeControlElement(copyrightDef);

export const TdtControlOverviewMapElement = makeControlElement(overviewMapDef);

export const TdtControlMapTypeElement = makeControlElement(mapTypeDef);
