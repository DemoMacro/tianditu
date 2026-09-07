import "../src";
import { TdtControlScaleElement, TdtControlZoomElement } from "../src/controls";
import { TdtGridlineLayerElement } from "../src/layers";
import { TdtMapElement, lnglatConverter } from "../src/tdt-map";
import { TdtPolylineToolElement } from "../src/tools";

import "./style.css";

const tk = import.meta.env.VITE_TIANDITU_BROWSER_KEY as string | undefined;

if (!tk) {
  document.body.innerHTML =
    '<p style="padding:2rem">缺少 <code>VITE_TIANDITU_BROWSER_KEY</code>：在 packages/web-components/.env 中配置天地图浏览器端 key 后重启。</p>';
} else {
  main();
}

/** 海量点演示数据：确定性点阵 */
function cloudPoints(): string {
  const points: string[] = [];
  for (let i = 0; i < 300; i++) {
    const col = i % 20;
    const row = Math.floor(i / 20);
    points.push(`${(116.3 + col * 0.01).toFixed(3)},${(39.82 + row * 0.008).toFixed(3)}`);
  }
  return points.join(";");
}

function main() {
  document.body.innerHTML = `
    <div class="toolbar">
      <button id="btn-tool" type="button">折线工具</button>
      <span id="tool-state">工具未开启</span>
    </div>
    <tdt-map tk="${tk}" center="116.404,39.915" zoom="12" style="width:100vw;height:calc(100vh - 40px)">
      <tdt-control-zoom position="bottomright"></tdt-control-zoom>
      <tdt-control-scale></tdt-control-scale>
      <tdt-gridline-layer opacity="0.6"></tdt-gridline-layer>

      <tdt-marker lnglat="116.404,39.915">
        <tdt-info-window open>
          <div class="win">天安门（web components）</div>
        </tdt-info-window>
      </tdt-marker>

      <!-- 点聚合收编：子级标注加入聚合而非直接上屏 -->
      <tdt-marker-clusterer grid-size="70">
        <tdt-marker lnglat="116.35,39.95"></tdt-marker>
        <tdt-marker lnglat="116.36,39.94"></tdt-marker>
        <tdt-marker lnglat="116.37,39.93"></tdt-marker>
      </tdt-marker-clusterer>

      <!-- 图层组收编：子级覆盖物加入图层组 -->
      <tdt-layer-group>
        <tdt-polyline path="116.38,39.9;116.42,39.92;116.44,39.9" color="#2563eb" weight="4"></tdt-polyline>
        <tdt-circle center="116.45,39.87" radius="800" fill-color="#dc2626" fill-opacity="0.3"></tdt-circle>
      </tdt-layer-group>

      <tdt-cloud-marker lnglats="${cloudPoints()}" styles='{"ShapeType":"CIRCLE","SizeType":"SMALL","color":"#7c3aed"}'></tdt-cloud-marker>

      <tdt-polyline-tool id="polyline-tool" color="#f59e0b" weight="3"></tdt-polyline-tool>
      <tdt-coordinate-pickup id="pickup"></tdt-coordinate-pickup>
    </tdt-map>
  `;

  const mapEl = document.querySelector<TdtMapElement>("tdt-map")!;
  mapEl.addEventListener("tdt-click", (e) =>
    console.log("[demo] map click", (e as CustomEvent).detail),
  );
  mapEl.addEventListener("tdt-zoomend", () => console.log("[demo] zoomend", mapEl.map?.getZoom()));

  // 覆盖物事件转发：点击标注应同时看到 marker 的 tdt-click
  document.querySelector("tdt-marker")?.addEventListener("tdt-click", () => {
    console.log("[demo] marker click");
  });

  const toolEl = document.querySelector("#polyline-tool") as InstanceType<
    typeof TdtPolylineToolElement
  >;
  const stateEl = document.querySelector("#tool-state")!;
  document.querySelector<HTMLButtonElement>("#btn-tool")!.addEventListener("click", () => {
    toolEl.active = !toolEl.active;
    stateEl.textContent = toolEl.active ? "折线工具开启" : "工具未开启";
  });
  toolEl.addEventListener("tdt-click", () => console.log("[demo] tool click"));
  document.querySelector("#pickup")?.addEventListener("tdt-pick", (e) => {
    console.log("[demo] pickup", (e as CustomEvent).detail);
  });

  // 类型冒烟：converter 与元素类可正常实例化
  console.log(
    "[demo] smoke",
    lnglatConverter("116.4,39.9"),
    [TdtMapElement, TdtControlZoomElement, TdtControlScaleElement, TdtGridlineLayerElement].every(
      Boolean,
    ),
  );
}
