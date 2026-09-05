import "../src";
import { TdtControlScaleElement, TdtControlZoomElement } from "../src/controls";
import { TdtInfoWindowElement } from "../src/info-window";
import { TdtCircleElement, TdtMarkerElement, TdtPolylineElement } from "../src/overlays";
import { TdtMapElement, lnglatConverter } from "../src/tdt-map";

import "./style.css";

const tk = import.meta.env.VITE_TIANDITU_BROWSER_KEY as string | undefined;

if (!tk) {
  document.body.innerHTML =
    '<p style="padding:2rem">缺少 <code>VITE_TIANDITU_BROWSER_KEY</code>：在 packages/web-components/.env 中配置天地图浏览器端 key 后重启。</p>';
} else {
  main();
}

function main() {
  document.body.innerHTML = `
    <tdt-map tk="${tk}" center="116.404,39.915" zoom="12" style="width:100vw;height:100vh">
      <tdt-control-zoom position="bottomright"></tdt-control-zoom>
      <tdt-control-scale></tdt-control-scale>
      <tdt-marker lnglat="116.404,39.915">
        <tdt-info-window open>
          <div class="win">天安门（web components）</div>
        </tdt-info-window>
      </tdt-marker>
      <tdt-polyline path="116.38,39.9;116.42,39.92;116.44,39.9" color="#2563eb" weight="4"></tdt-polyline>
      <tdt-circle center="116.45,39.87" radius="800" fill-color="#dc2626" fill-opacity="0.3"></tdt-circle>
    </tdt-map>
  `;

  const mapEl = document.querySelector<TdtMapElement>("tdt-map")!;
  mapEl.addEventListener("tdt-click", (e) =>
    console.log("[demo] map click", (e as CustomEvent).detail),
  );
  mapEl.addEventListener("tdt-zoomend", () => console.log("[demo] zoomend", mapEl.map?.getZoom()));

  // 类型冒烟：converter 与元素类可正常实例化
  console.log(
    "[demo] smoke",
    lnglatConverter("116.4,39.9"),
    [
      TdtMapElement,
      TdtMarkerElement,
      TdtPolylineElement,
      TdtCircleElement,
      TdtControlZoomElement,
      TdtControlScaleElement,
      TdtInfoWindowElement,
    ].every(Boolean),
  );
}
