import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  TdtCircle,
  TdtCloudMarker,
  TdtContextMenu,
  TdtContextMenuItem,
  TdtControlCopyright,
  TdtControlPlotSymbols,
  TdtControlScale,
  TdtControlZoom,
  TdtGridlineLayer,
  TdtInfoWindow,
  TdtLabel,
  TdtLayerGroup,
  TdtMap,
  TdtMarker,
  TdtMarkerCluster,
  TdtPolygon,
  TdtPolyline,
  TdtPolylineTool,
  TdtRectangle,
  TdtStraightArrow,
  TdtStraightArrowTool,
  useAdministrativeDivision,
  useDataSources,
  useLocalCity,
  useLocalSearch,
  useMap,
} from "../src";

import "./style.css";

const tk = import.meta.env.VITE_TIANDITU_BROWSER_KEY as string | undefined;

/** 海量点演示数据：以天安门为中心的确定性点阵（官方 CloudMarkerCollection 适用于万级点） */
function cloudPoints(): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let i = 0; i < 400; i++) {
    const col = i % 20;
    const row = Math.floor(i / 20);
    points.push([116.3 + col * 0.01 + (row % 3) * 0.002, 39.82 + row * 0.008]);
  }
  return points;
}

/**
 * 搜索面板：useLocalSearch 依赖 TdtMap 向下提供的地图 Context，因此面板
 * 渲染为 TdtMap 的子组件，悬浮于地图左上角。
 */
function Panel({
  onFocus,
}: {
  onFocus: (focus: { lnglat: [number, number]; name: string }) => void;
}) {
  const { map } = useMap();
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [serviceTip, setServiceTip] = useState("");
  const { search: localSearch, results, status } = useLocalSearch();
  const { location: locateCity } = useLocalCity();
  const { search: searchDataSource } = useDataSources();
  const { search: searchDivision } = useAdministrativeDivision();

  function moveTo(lnglat: [number, number], name: string) {
    if (!map) {
      return;
    }
    onFocus({ lnglat, name });
    map.centerAndZoom(new T.LngLat(lnglat[0], lnglat[1]), 14);
  }

  useEffect(() => {
    setSearched(true);
    const pois = Array.isArray(results?.pois) ? results.pois : [];
    const first = pois[0];
    // 首条结果自动定位（lonlat 为官方 "lng,lat" 字符串）
    if (first) {
      const [lng, lat] = first.lonlat.split(",").map(Number);
      moveTo([lng, lat], first.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在检索结果返回时自动定位
  }, [results]);

  /** 无图服务示例：本地城市定位 + 数据来源 + 行政区划，各自回调互不阻塞 */
  function runServices() {
    void locateCity().then((city) => {
      console.log("[demo] LocalCity", city);
      if (city) {
        setServiceTip(`${city.cityName}（最佳级别 ${city.level}）`);
      }
    });
    void searchDataSource({ level: map?.getZoom() ?? 12 }).then((ds) =>
      console.log("[demo] DataSources", ds),
    );
    void searchDivision({ searchWord: "北京", searchType: 1, needSubInfo: false }).then(
      (division) =>
        console.log(
          "[demo] AdministrativeDivision",
          division ? division.getStatus() : null,
          division?.getMsg(),
        ),
    );
  }

  const pois = Array.isArray(results?.pois) ? results.pois : [];

  return (
    <div className="panel">
      <div className="searchbar">
        <input
          className="search-input"
          placeholder="搜索地点，如：天安门"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && keyword.trim()) {
              localSearch(keyword.trim());
            }
          }}
        />
        <button
          className="search-btn"
          onClick={() => keyword.trim() && localSearch(keyword.trim())}
        >
          搜索
        </button>
      </div>
      <div className="toolbar">
        <button
          className="tool"
          title="本地城市定位 / 数据来源 / 行政区划（结果见控制台）"
          onClick={runServices}
        >
          🧭 服务
        </button>
      </div>
      {serviceTip ? <p className="tip">{serviceTip}</p> : null}
      {status === "loading" ? (
        <p className="tip">搜索中…</p>
      ) : results ? (
        pois.length ? (
          <>
            <p className="count">共 {results?.count} 条结果</p>
            {pois.map((poi) => (
              <div
                key={poi.name}
                className="poi"
                onClick={() => {
                  const [lng, lat] = poi.lonlat.split(",").map(Number);
                  moveTo([lng, lat], poi.name);
                }}
              >
                <div className="poi-name">{poi.name}</div>
                {poi.address ? <div className="poi-addr">{poi.address}</div> : null}
              </div>
            ))}
          </>
        ) : (
          <p className="tip">未找到相关地点</p>
        )
      ) : searched ? (
        <p className="tip">未找到相关地点</p>
      ) : (
        <p className="tip">输入关键词搜索，点击结果定位到地图</p>
      )}
    </div>
  );
}

function App() {
  const [focus, setFocus] = useState<{ lnglat: [number, number]; name: string } | undefined>(
    undefined,
  );
  const [drawing, setDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState(false);

  return (
    <>
      <TdtMap
        tk={tk ?? ""}
        center={[116.404, 39.915]}
        zoom={12}
        onClick={(e) => console.log("[demo] map click", e.lnglat)}
        onReady={(map) => console.log("[demo] ready", map.getZoom())}
      >
        <TdtControlZoom position="bottomright" />
        <TdtControlScale />
        <TdtControlCopyright />
        <TdtControlPlotSymbols position="topright" />

        <TdtContextMenu onOpen={() => console.log("[demo] menu open")}>
          <TdtContextMenuItem
            text="日志此点"
            onSelect={(lnglat) => console.log("[demo] menu", lnglat)}
          />
        </TdtContextMenu>

        <TdtPolylineTool
          active={activeTool}
          color="#f97316"
          onDraw={(e) => console.log("[demo] line drawn", e)}
        />
        <TdtStraightArrowTool
          active={drawing}
          onDbclick={(e) => console.log("[demo] arrow finished", e)}
        />

        {/* 搜索选中点：定位 + 名称标注窗 */}
        {focus ? (
          <TdtMarker lnglat={focus.lnglat}>
            <TdtInfoWindow open onClose={() => setFocus(undefined)}>
              <div className="win">
                <b>{focus.name}</b>
              </div>
            </TdtInfoWindow>
          </TdtMarker>
        ) : null}

        <TdtMarkerCluster>
          <TdtMarker lnglat={[116.41, 39.92]} />
          <TdtMarker lnglat={[116.42, 39.91]} />
        </TdtMarkerCluster>

        <TdtPolyline
          path={[
            [116.38, 39.9],
            [116.42, 39.92],
            [116.44, 39.9],
          ]}
          color="#2563eb"
          weight={4}
        />
        <TdtPolygon
          path={[
            [116.35, 39.86],
            [116.38, 39.86],
            [116.38, 39.88],
            [116.35, 39.88],
          ]}
          fillColor="#16a34a"
          fillOpacity={0.35}
        />
        <TdtCircle center={[116.45, 39.87]} radius={800} fillColor="#dc2626" fillOpacity={0.3} />
        <TdtRectangle
          bounds={[
            [116.33, 39.94],
            [116.35, 39.96],
          ]}
          fillColor="#ca8a04"
          fillOpacity={0.3}
        />
        <TdtLabel text="奥体中心" lnglat={[116.39, 40]} />

        {/* 图层容器：子级标注经收集器加入容器（卸载随容器清空） */}
        <TdtLayerGroup>
          <TdtMarker lnglat={[116.46, 39.93]} />
          <TdtMarker lnglat={[116.47, 39.92]} />
        </TdtLayerGroup>

        {/* 海量点：400 个点整批展示 */}
        <TdtCloudMarker
          lnglats={cloudPoints()}
          styles={{ ShapeType: "CIRCLE", SizeType: "SMALL", color: "#7c3aed" }}
        />

        {/* 格网图层 */}
        <TdtGridlineLayer tileSize={256} />

        <TdtStraightArrow
          path={[
            [116.32, 39.98],
            [116.36, 39.96],
            [116.4, 39.97],
          ]}
          color="#dc2626"
          weight={5}
        />

        <div className="toolbar" style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <button
            className={activeTool ? "tool active" : "tool"}
            title="测距（地图上左键取点，双击结束）"
            onClick={() => {
              setFocus(undefined);
              setActiveTool(!activeTool);
            }}
          >
            📏 测距
          </button>
          <button
            className={drawing ? "tool active" : "tool"}
            title="直箭头绘制（双击结束）"
            onClick={() => {
              setFocus(undefined);
              setDrawing(!drawing);
            }}
          >
            ➡ 箭头
          </button>
        </div>

        <Panel onFocus={setFocus} />
      </TdtMap>
    </>
  );
}

if (!tk) {
  document.body.innerHTML =
    '<p style="padding:2rem">缺少 <code>VITE_TIANDITU_BROWSER_KEY</code>：在 packages/react/.env.local 中配置天地图浏览器端 key 后重启。</p>';
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
