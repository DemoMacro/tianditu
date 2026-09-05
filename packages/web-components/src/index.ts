import { TdtControlScaleElement, TdtControlZoomElement } from "./controls";
import { TdtInfoWindowElement } from "./info-window";
import { TdtCircleElement, TdtMarkerElement, TdtPolylineElement } from "./overlays";
import { TdtMapElement } from "./tdt-map";

export { TdtMapElement, lnglatConverter } from "./tdt-map";
export { TdtMarkerElement, TdtPolylineElement, TdtCircleElement } from "./overlays";
export { TdtControlZoomElement, TdtControlScaleElement } from "./controls";
export { TdtInfoWindowElement } from "./info-window";

customElements.define("tdt-map", TdtMapElement);
customElements.define("tdt-marker", TdtMarkerElement);
customElements.define("tdt-polyline", TdtPolylineElement);
customElements.define("tdt-circle", TdtCircleElement);
customElements.define("tdt-control-zoom", TdtControlZoomElement);
customElements.define("tdt-control-scale", TdtControlScaleElement);
customElements.define("tdt-info-window", TdtInfoWindowElement);
