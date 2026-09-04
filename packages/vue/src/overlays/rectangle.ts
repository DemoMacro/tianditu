import { defineOverlayComponent } from "../defineOverlayComponent";

export interface RectangleProps {
  /** 西南角与东北角坐标 [[swLng, swLat], [neLng, neLat]] */
  bounds: [[number, number], [number, number]] | T.LngLatBounds;
  color?: string;
  weight?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export const TdtRectangle = defineOverlayComponent<RectangleProps, T.Rectangle>({
  name: "TdtRectangle",
  props: {
    bounds: { type: Array, required: true },
    color: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    fillColor: { type: String, default: undefined },
    fillOpacity: { type: Number, default: undefined },
  },
  events: ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout"] as const,
  create(props) {
    const rectangle = new T.Rectangle(toBoundsProp(props.bounds), {
      color: props.color,
      weight: props.weight,
      fillColor: props.fillColor,
      fillOpacity: props.fillOpacity,
    });
    return rectangle;
  },
  sync: {
    bounds: (rectangle, value) => rectangle.setBounds(toBoundsProp(value)),
    fillColor: (rectangle, value) => {
      if (value !== undefined) rectangle.setFillColor(value);
    },
    fillOpacity: (rectangle, value) => {
      if (value !== undefined) rectangle.setFillOpacity(value);
    },
  },
});

function toBoundsProp(
  value: [[number, number], [number, number]] | T.LngLatBounds,
): T.LngLatBounds {
  if (Array.isArray(value)) {
    const [[swLng, swLat], [neLng, neLat]] = value;
    return new T.LngLatBounds(new T.LngLat(swLng, swLat), new T.LngLat(neLng, neLat));
  }
  return value;
}
