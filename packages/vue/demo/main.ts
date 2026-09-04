import { createApp, defineComponent, h, ref, watch } from "vue";

import {
  TdtCarTrack,
  TdtCircle,
  TdtControlCopyright,
  TdtControlMilitarySymbols,
  TdtControlScale,
  TdtControlZoom,
  TdtContextMenu,
  TdtContextMenuItem,
  TdtInfoWindow,
  TdtLabel,
  TdtMap,
  TdtMarker,
  TdtMarkerCluster,
  TdtPolygon,
  TdtPolyline,
  TdtPolylineTool,
  TdtRectangle,
  TdtStraightArrow,
  TdtStraightArrowTool,
  useGeocoder,
  useLocalSearch,
  useMap,
} from "../src";

import "./style.css";

const tk = import.meta.env.VITE_TIANDITU_BROWSER_KEY as string | undefined;

if (!tk) {
  document.body.innerHTML =
    '<p style="padding:2rem">缺少 <code>VITE_TIANDITU_BROWSER_KEY</code>：在 packages/vue/demo/.env.local 中配置天地图浏览器端 key 后重启。</p>';
} else {
  main();
}

function main() {
  const center = ref([116.404, 39.915]);
  const zoom = ref(12);
  const openWindow = ref(false);
  const drawing = ref(false);
  const activeTool = ref<"none" | "line">("none");
  const searchResult = ref("");
  const carTrackRef = ref();

  // 命令式逃生舱演示：useMap 直取 SDK 实例
  const MapStatus = defineComponent({
    setup() {
      const { map } = useMap();
      return () => (map.value ? `级别 ${map.value.getZoom()}` : "加载中");
    },
  });

  const { search: localSearch, searchInBounds, results } = useLocalSearch();
  const { getLocation } = useGeocoder();

  watch(results, (value) => {
    if (!value) {
      searchResult.value = "无结果";
      return;
    }
    const pois = Array.isArray(value.pois) ? value.pois : [];
    searchResult.value = `共 ${value.count} 条，首条：${pois[0]?.name ?? "无"}`;
  });

  function searchPOI() {
    searchResult.value = "搜索中…";
    localSearch("餐厅");
  }

  function searchInViewport() {
    searchResult.value = "视野内搜索中…";
    searchInBounds(
      "银行",
      new T.LngLatBounds(new T.LngLat(116.32, 39.83), new T.LngLat(116.5, 40.0)),
    );
  }

  async function geocode() {
    searchResult.value = "解析中…";
    const result = await getLocation([116.37304, 39.92594]);
    searchResult.value = result ? result.getAddress() : "解析失败";
  }

  const App = defineComponent({
    setup() {
      return () =>
        h("div", { class: "layout" }, [
          h("div", { class: "map" }, [
            h(
              TdtMap as never,
              {
                tk,
                center: center.value,
                zoom: zoom.value,
                style: { width: "100%", height: "100%" },
              },
              () => [
                h(TdtControlZoom as never),
                h(TdtControlScale as never),
                h(TdtControlCopyright as never),
                h(TdtControlMilitarySymbols as never, { position: "topleft" }),

                h(TdtContextMenu as never, null, () => [
                  h(TdtContextMenuItem as never, {
                    text: "日志此点",
                    onSelect: (lnglat: T.LngLat) => console.log("[demo] menu", lnglat),
                  }),
                ]),

                h(TdtPolylineTool as never, {
                  active: activeTool.value === "line",
                  color: "#f97316",
                  onDraw: (e: unknown) => console.log("[demo] line drawn", e),
                }),
                h(TdtStraightArrowTool as never, {
                  active: drawing.value,
                  onDbclick: (e: unknown) => console.log("[demo] arrow finished", e),
                }),

                h(TdtMarker as never, { lnglat: [116.404, 39.915] }, () => [
                  h(TdtInfoWindow as never, { open: openWindow.value }, () => [
                    h("div", { class: "win" }, [h("b", "天安门"), h(MapStatus as never)]),
                  ]),
                ]),

                h(TdtMarkerCluster as never, () => [
                  h(TdtMarker as never, { key: "a", lnglat: [116.41, 39.92] }),
                  h(TdtMarker as never, { key: "b", lnglat: [116.42, 39.91] }),
                ]),

                h(TdtPolyline as never, {
                  path: [
                    [116.38, 39.9],
                    [116.42, 39.92],
                    [116.44, 39.9],
                  ],
                  color: "#2563eb",
                  weight: 4,
                }),
                h(TdtPolygon as never, {
                  path: [
                    [116.35, 39.86],
                    [116.38, 39.86],
                    [116.38, 39.88],
                    [116.35, 39.88],
                  ],
                  fillColor: "#16a34a",
                  fillOpacity: 0.35,
                }),
                h(TdtCircle as never, {
                  center: [116.45, 39.87],
                  radius: 800,
                  fillColor: "#dc2626",
                  fillOpacity: 0.3,
                }),
                h(TdtRectangle as never, {
                  bounds: [
                    [116.33, 39.94],
                    [116.35, 39.96],
                  ],
                  fillColor: "#ca8a04",
                  fillOpacity: 0.3,
                }),
                h(TdtLabel as never, { text: "奥体中心", lnglat: [116.39, 40.0] }),

                h(TdtStraightArrow as never, {
                  path: [
                    [116.32, 39.98],
                    [116.36, 39.96],
                    [116.4, 39.97],
                  ],
                  color: "#dc2626",
                  weight: 5,
                }),

                h(TdtCarTrack as never, {
                  ref: carTrackRef,
                  datas: [
                    [116.404, 39.915],
                    [116.418, 39.92],
                    [116.43, 39.925],
                  ],
                  interval: 500,
                }),
              ],
            ),
          ]),
          h("div", { class: "panel" }, [
            h("h1", "@tianditu/vue demo"),
            h(MapStatus as never),
            h("button", { onClick: () => (zoom.value += 1) }, "zoom+1（props 同步）"),
            h(
              "button",
              { onClick: () => (openWindow.value = !openWindow.value) },
              "开关 InfoWindow",
            ),
            h(
              "button",
              { onClick: () => (activeTool.value = activeTool.value === "line" ? "none" : "line") },
              "开关测距工具",
            ),
            h("button", { onClick: () => (drawing.value = !drawing.value) }, "开关直箭头绘制"),
            h("button", { onClick: () => carTrackRef.value?.start() }, "轨迹回放"),
            h("button", { onClick: searchPOI }, "关键词搜餐厅"),
            h("button", { onClick: searchInViewport }, "视野内搜银行"),
            h("button", { onClick: () => void geocode() }, "逆地理编码"),
            h("p", { class: "result" }, searchResult.value),
          ]),
        ]);
    },
  });

  createApp(App).mount("#app");
}
