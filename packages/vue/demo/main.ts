import { createApp, defineComponent, h, ref, watch } from "vue";

import {
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
    '<p style="padding:2rem">缺少 <code>VITE_TIANDITU_BROWSER_KEY</code>：在 packages/vue/.env.local 中配置天地图浏览器端 key 后重启。</p>';
} else {
  main();
}

function main() {
  const center = ref([116.404, 39.915]);
  const zoom = ref(12);
  const openWindow = ref(false);
  const drawing = ref(false);
  const activeTool = ref<"none" | "line">("none");

  /**
   * 控制面板：useMap / useLocalSearch 等依赖 TdtMap 向下 provide 的地图
   * 上下文，因此整个面板渲染为 TdtMap 的子组件，绝对定位覆盖在地图上。
   */
  const Panel = defineComponent({
    setup() {
      const { map } = useMap();
      const searchResult = ref("");
      const level = ref<number>();
      const { search: localSearch, searchInBounds, results } = useLocalSearch();
      const { getLocation } = useGeocoder();

      // 级别随 SDK zoomend 事件刷新（useMap 命令式监听演示）
      watch(
        map,
        (instance) => {
          if (!instance) {
            return;
          }
          level.value = instance.getZoom();
          instance.addEventListener("zoomend", () => {
            level.value = instance.getZoom();
          });
        },
        { immediate: true },
      );

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

      const item = (label: string, active: boolean, onClick: () => void) =>
        h("a", { class: active ? "item active" : "item", onClick }, label);

      return () =>
        h("div", { class: "panel" }, [
          h("h1", "@tianditu/vue demo"),
          h(
            "p",
            { class: "desc" },
            "对照官方示例的功能演示。地图绘制：左键取点、双击结束；地图空白处右键菜单。",
          ),
          h("div", { class: "group" }, "地图操作"),
          item("zoom+1（props 同步）", false, () => (zoom.value += 1)),
          h("div", { class: "group" }, "覆盖物"),
          item("开关 InfoWindow", openWindow.value, () => (openWindow.value = !openWindow.value)),
          h("div", { class: "group" }, "地图工具"),
          item(
            "测距工具（双击结束）",
            activeTool.value === "line",
            () => (activeTool.value = activeTool.value === "line" ? "none" : "line"),
          ),
          item("直箭头绘制", drawing.value, () => (drawing.value = !drawing.value)),
          h("div", { class: "group" }, "服务检索"),
          item("关键词搜餐厅", false, searchPOI),
          item("视野内搜银行", false, searchInViewport),
          item("逆地理编码", false, () => void geocode()),
          h("p", { class: "status" }, level.value ? `当前级别 ${level.value}` : "加载中…"),
          h("p", { class: "result" }, searchResult.value),
        ]);
    },
  });

  const App = defineComponent({
    setup() {
      return () =>
        h(
          TdtMap as never,
          {
            tk,
            center: center.value,
            zoom: zoom.value,
            style: { width: "calc(100vw - 230px)", height: "100vh", marginLeft: "230px" },
          },
          () => [
            h(TdtControlZoom as never),
            h(TdtControlScale as never),
            h(TdtControlCopyright as never),
            h(TdtControlMilitarySymbols as never, { position: "topright" }),

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
                h("div", { class: "win" }, [h("b", "天安门")]),
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

            h(Panel),
          ],
        );
    },
  });

  createApp(App).mount("#app");
}
