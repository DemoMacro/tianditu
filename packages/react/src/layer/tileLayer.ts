import { tileLayerDef, tileLayerTdtDef, tileLayerWmsDef } from "@tianditu/core";

import { defineLayerComponent } from "../defineLayerComponent";

export type { TileLayerProps, TileLayerWMSProps, TileLayerTDTProps } from "@tianditu/core";

export const TdtTileLayer = defineLayerComponent(tileLayerDef);

export const TdtTileLayerWMS = defineLayerComponent(tileLayerWmsDef);

export const TdtTileLayerTDT = defineLayerComponent(tileLayerTdtDef);
