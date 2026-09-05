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
  const zoom = ref(12);
  const drawing = ref(false);
  const activeTool = ref<"none" | "line">("none");
  /** 搜索选中的地点：地图定位并打开名称标注窗 */
  const focus = ref<{ lnglat: [number, number]; name: string }>();

  /**
   * 搜索面板：useLocalSearch 依赖 TdtMap 向下 provide 的地图上下文，
   * 因此面板渲染为 TdtMap 的子组件，悬浮于地图左上角。
   */
  const Panel = defineComponent({
    setup() {
      const { map } = useMap();
      const keyword = ref("");
      const searched = ref(false);
      const { search: localSearch, results, status } = useLocalSearch();

      function moveTo(lnglat: [number, number], name: string) {
        if (!map.value) {
          return;
        }
        focus.value = { lnglat, name };
        map.value.centerAndZoom(new T.LngLat(lnglat[0], lnglat[1]), 14);
      }

      watch(results, (value) => {
        searched.value = true;
        const pois = Array.isArray(value?.pois) ? value.pois : [];
        const first = pois[0];
        // 首条结果自动定位（lonlat 为官方 "lng,lat" 字符串）
        if (first) {
          const [lng, lat] = first.lonlat.split(",").map(Number);
          moveTo([lng, lat], first.name);
        }
      });

      function submit() {
        if (!keyword.value.trim()) {
          return;
        }
        localSearch(keyword.value.trim());
      }

      function locate(poi: T.LocalSearchPoi) {
        const [lng, lat] = poi.lonlat.split(",").map(Number);
        moveTo([lng, lat], poi.name);
      }

      return () =>
        h("div", { class: "panel" }, [
          h("div", { class: "searchbar" }, [
            h("input", {
              class: "search-input",
              placeholder: "搜索地点，如：天安门",
              value: keyword.value,
              onInput: (e: InputEvent) => (keyword.value = (e.target as HTMLInputElement).value),
              onKeydown: (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  submit();
                }
              },
            }),
            h("button", { class: "search-btn", onClick: submit }, "搜索"),
          ]),
          h("div", { class: "toolbar" }, [
            h(
              "button",
              {
                class: activeTool.value === "line" ? "tool active" : "tool",
                title: "测距（地图上左键取点，双击结束）",
                onClick: () => {
                  // 绘制期间收起标注窗，避免遮挡取点
                  focus.value = undefined;
                  activeTool.value = activeTool.value === "line" ? "none" : "line";
                },
              },
              "📏 测距",
            ),
            h(
              "button",
              {
                class: drawing.value ? "tool active" : "tool",
                title: "直箭头绘制（双击结束）",
                onClick: () => {
                  focus.value = undefined;
                  drawing.value = !drawing.value;
                },
              },
              "➡ 箭头",
            ),
          ]),
          status.value === "loading"
            ? h("p", { class: "tip" }, "搜索中…")
            : results.value
              ? (() => {
                  const value = results.value;
                  const pois = Array.isArray(value.pois) ? value.pois : [];
                  return pois.length
                    ? [
                        h("p", { class: "count" }, `共 ${value.count} 条结果`),
                        ...pois.map((poi) =>
                          h("div", { class: "poi", onClick: () => locate(poi) }, [
                            h("div", { class: "poi-name" }, poi.name),
                            poi.address ? h("div", { class: "poi-addr" }, poi.address) : null,
                          ]),
                        ),
                      ]
                    : [h("p", { class: "tip" }, "未找到相关地点")];
                })()
              : searched.value
                ? [h("p", { class: "tip" }, "未找到相关地点")]
                : [h("p", { class: "tip" }, "输入关键词搜索，点击结果定位到地图")],
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
            center: [116.404, 39.915],
            zoom: zoom.value,
            style: { width: "100vw", height: "100vh" },
          },
          () => [
            h(TdtControlZoom as never, { position: "bottomright" }),
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

            // 搜索选中点：定位 + 名称标注窗
            focus.value
              ? h(TdtMarker as never, { lnglat: focus.value.lnglat }, () => [
                  h(TdtInfoWindow as never, { open: true }, () => [
                    h("div", { class: "win" }, [h("b", focus.value?.name)]),
                  ]),
                ])
              : null,

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
