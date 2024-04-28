/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
  interface TdtControl {
    control: T.Control;
    offset?: T.Point;
    options?: T.ControlOptions;
    position?: T.ControlPosition;
    uniqueId: string;
    visible: boolean;
  }
  interface TdtControlCopyright {
    content?: string;
    position: T.ControlPosition;
    uniqueId: string;
  }
  interface TdtControlOverviewMap {
    isOpen: T.ControlOverviewMapOptions["isOpen"];
    position: T.ControlPosition;
    uniqueId: string;
  }
  interface TdtControlScale {
    color?: string;
    position: T.ControlPosition;
    uniqueId: string;
  }
  interface TdtControlZoom {
    position: T.ControlPosition;
    uniqueId: string;
    zoomInText?: T.ControlZoomOptions["zoomInText"];
    zoomInTitle?: T.ControlZoomOptions["zoomInTitle"];
    zoomOutText?: T.ControlZoomOptions["zoomOutText"];
    zoomOutTitle?: T.ControlZoomOptions["zoomOutTitle"];
  }
  interface TdtMap {
    center: number[];
    maxBounds: T.MapOptions["maxBounds"];
    maxZoom: T.MapOptions["maxZoom"];
    minZoom: T.MapOptions["minZoom"];
    projection: T.MapOptions["projection"];
    tk: string;
    uniqueId: string;
    zoom: T.MapOptions["zoom"];
  }
}
declare global {
  interface HTMLTdtControlElement
    extends Components.TdtControl,
      HTMLStencilElement {}
  var HTMLTdtControlElement: {
    prototype: HTMLTdtControlElement;
    new (): HTMLTdtControlElement;
  };
  interface HTMLTdtControlCopyrightElement
    extends Components.TdtControlCopyright,
      HTMLStencilElement {}
  var HTMLTdtControlCopyrightElement: {
    prototype: HTMLTdtControlCopyrightElement;
    new (): HTMLTdtControlCopyrightElement;
  };
  interface HTMLTdtControlOverviewMapElement
    extends Components.TdtControlOverviewMap,
      HTMLStencilElement {}
  var HTMLTdtControlOverviewMapElement: {
    prototype: HTMLTdtControlOverviewMapElement;
    new (): HTMLTdtControlOverviewMapElement;
  };
  interface HTMLTdtControlScaleElement
    extends Components.TdtControlScale,
      HTMLStencilElement {}
  var HTMLTdtControlScaleElement: {
    prototype: HTMLTdtControlScaleElement;
    new (): HTMLTdtControlScaleElement;
  };
  interface HTMLTdtControlZoomElement
    extends Components.TdtControlZoom,
      HTMLStencilElement {}
  var HTMLTdtControlZoomElement: {
    prototype: HTMLTdtControlZoomElement;
    new (): HTMLTdtControlZoomElement;
  };
  interface HTMLTdtMapElement extends Components.TdtMap, HTMLStencilElement {}
  var HTMLTdtMapElement: {
    prototype: HTMLTdtMapElement;
    new (): HTMLTdtMapElement;
  };
  interface HTMLElementTagNameMap {
    "tdt-control": HTMLTdtControlElement;
    "tdt-control-copyright": HTMLTdtControlCopyrightElement;
    "tdt-control-overview-map": HTMLTdtControlOverviewMapElement;
    "tdt-control-scale": HTMLTdtControlScaleElement;
    "tdt-control-zoom": HTMLTdtControlZoomElement;
    "tdt-map": HTMLTdtMapElement;
  }
}
declare namespace LocalJSX {
  interface TdtControl {
    control: T.Control;
    offset?: T.Point;
    options?: T.ControlOptions;
    position?: T.ControlPosition;
    uniqueId: string;
    visible?: boolean;
  }
  interface TdtControlCopyright {
    content?: string;
    position?: T.ControlPosition;
    uniqueId: string;
  }
  interface TdtControlOverviewMap {
    isOpen?: T.ControlOverviewMapOptions["isOpen"];
    position?: T.ControlPosition;
    uniqueId: string;
  }
  interface TdtControlScale {
    color?: string;
    position?: T.ControlPosition;
    uniqueId: string;
  }
  interface TdtControlZoom {
    position?: T.ControlPosition;
    uniqueId: string;
    zoomInText?: T.ControlZoomOptions["zoomInText"];
    zoomInTitle?: T.ControlZoomOptions["zoomInTitle"];
    zoomOutText?: T.ControlZoomOptions["zoomOutText"];
    zoomOutTitle?: T.ControlZoomOptions["zoomOutTitle"];
  }
  interface TdtMap {
    center?: number[];
    maxBounds: T.MapOptions["maxBounds"];
    maxZoom: T.MapOptions["maxZoom"];
    minZoom: T.MapOptions["minZoom"];
    projection: T.MapOptions["projection"];
    tk: string;
    uniqueId?: string;
    zoom: T.MapOptions["zoom"];
  }
  interface IntrinsicElements {
    "tdt-control": TdtControl;
    "tdt-control-copyright": TdtControlCopyright;
    "tdt-control-overview-map": TdtControlOverviewMap;
    "tdt-control-scale": TdtControlScale;
    "tdt-control-zoom": TdtControlZoom;
    "tdt-map": TdtMap;
  }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      "tdt-control": LocalJSX.TdtControl &
        JSXBase.HTMLAttributes<HTMLTdtControlElement>;
      "tdt-control-copyright": LocalJSX.TdtControlCopyright &
        JSXBase.HTMLAttributes<HTMLTdtControlCopyrightElement>;
      "tdt-control-overview-map": LocalJSX.TdtControlOverviewMap &
        JSXBase.HTMLAttributes<HTMLTdtControlOverviewMapElement>;
      "tdt-control-scale": LocalJSX.TdtControlScale &
        JSXBase.HTMLAttributes<HTMLTdtControlScaleElement>;
      "tdt-control-zoom": LocalJSX.TdtControlZoom &
        JSXBase.HTMLAttributes<HTMLTdtControlZoomElement>;
      "tdt-map": LocalJSX.TdtMap & JSXBase.HTMLAttributes<HTMLTdtMapElement>;
    }
  }
}