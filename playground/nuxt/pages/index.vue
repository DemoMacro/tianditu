<script setup>
import {
  TdtCarTrack,
  TdtCircle,
  TdtControlCopyright,
  TdtControlOverviewMap,
  TdtControlScale,
  TdtControlZoom,
  TdtInfoWindow,
  TdtLabel,
  TdtMap,
  TdtMarker,
  TdtMarkerCluster,
  TdtPolygon,
  TdtPolyline,
  TdtPolygonTool,
  TdtPolylineTool,
  TdtRectangle,
  TdtTileLayer,
  useMap,
} from "@tianditu/vue";

const config = useRuntimeConfig();
const tk = config.public.tianditu.browserKey;

const center = ref([116.404, 39.915]);
const zoom = ref(12);
const showOverlays = ref(true);
const openWindow = ref(false);
const mapRef = ref();
const activeTool = ref("none");
const showAnnoLayer = ref(false);
const carTrackRef = ref();

const carTrackDatas = [
  [116.404, 39.915],
  [116.418, 39.92],
  [116.43, 39.925],
  [116.44, 39.91],
  [116.42, 39.9],
];

function toggleLineTool() {
  activeTool.value = activeTool.value === "line" ? "none" : "line";
}

function togglePolygonTool() {
  activeTool.value = activeTool.value === "polygon" ? "none" : "polygon";
}

function startCarTrack() {
  carTrackRef.value?.start();
}

function pauseCarTrack() {
  carTrackRef.value?.pause();
}

const markers = [
  { lnglat: [116.4, 39.92], name: "聚合点 A" },
  { lnglat: [116.41, 39.915], name: "聚合点 B" },
  { lnglat: [116.395, 39.91], name: "聚合点 C" },
];

function zoomIn() {
  zoom.value += 1;
}

function flyTo() {
  center.value = [116.326, 39.983];
  zoom.value = 15;
}

function onMapReady(map) {
  console.log("[demo] map ready", map);
}

// 命令式逃生舱：直接操作 SDK 实例
const ChildComponent = defineComponent({
  setup() {
    const { map } = useMap();
    const zoomText = computed(() => (map.value ? `当前级别 ${map.value.getZoom()}` : "加载中"));
    return () => h("span", zoomText.value);
  },
});

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      center.value = [position.coords.longitude, position.coords.latitude];
    },
    null,
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
  );
});
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1">
      <TdtMap
        ref="mapRef"
        :tk="tk"
        :center="center"
        :zoom="zoom"
        style="width: 100%; height: 100%"
        @ready="onMapReady"
        @zoomend="() => console.log('[demo] zoomend')"
      >
        <TdtControlZoom />
        <TdtControlScale />
        <TdtControlCopyright />
        <TdtControlOverviewMap />

        <TdtTileLayer v-if="showAnnoLayer" :url="`http://t0.tianditu.gov.cn/cva_w/wmts?tk=${tk}`" />

        <TdtPolylineTool
          :active="activeTool === 'line'"
          color="#f97316"
          @draw="(e) => console.log('[demo] line drawn', e.currentDistance)"
        />
        <TdtPolygonTool
          :active="activeTool === 'polygon'"
          fill-color="#f97316"
          @draw="(e) => console.log('[demo] polygon drawn', e.currentArea)"
        />

        <TdtCarTrack
          ref="carTrackRef"
          :datas="carTrackDatas"
          :interval="500"
          :speed="0"
          :dynamic-line="true"
          @pass-one-node="(p) => console.log('[demo] car node', p.index, '/', p.length)"
        />

        <template v-if="showOverlays">
          <TdtMarker :lnglat="[116.404, 39.915]" draggable>
            <TdtInfoWindow v-model:open="openWindow">
              <div class="p-2">
                <p class="font-bold">天安门 InfoWindow</p>
                <ChildComponent />
              </div>
            </TdtInfoWindow>
          </TdtMarker>

          <TdtMarkerCluster>
            <TdtMarker
              v-for="m in markers"
              :key="m.name"
              :lnglat="m.lnglat"
              @click="() => console.log('[demo] cluster marker click', m.name)"
            />
          </TdtMarkerCluster>

          <TdtPolyline
            :path="[
              [116.38, 39.9],
              [116.42, 39.92],
              [116.44, 39.9],
            ]"
            color="#2563eb"
            :weight="4"
          />
          <TdtPolygon
            :path="[
              [116.35, 39.86],
              [116.38, 39.86],
              [116.38, 39.88],
              [116.35, 39.88],
            ]"
            fill-color="#16a34a"
            :fill-opacity="0.35"
          />
          <TdtCircle
            :center="[116.45, 39.87]"
            :radius="800"
            fill-color="#dc2626"
            :fill-opacity="0.3"
          />
          <TdtRectangle
            :bounds="[
              [116.33, 39.94],
              [116.35, 39.96],
            ]"
            fill-color="#ca8a04"
            :fill-opacity="0.3"
          />
          <TdtLabel text="奥体中心" :lnglat="[116.39, 40.0]" />
        </template>
      </TdtMap>
    </div>

    <div class="flex w-72 flex-col gap-2 overflow-auto p-4">
      <h1 class="font-bold">tianditu vue playground</h1>
      <p class="text-sm text-gray-500">
        zoom: {{ zoom }} / center: {{ center[0].toFixed(3) }},
        {{ center[1].toFixed(3) }}
      </p>
      <button class="btn" @click="zoomIn">zoom+1（props 同步）</button>
      <button class="btn" @click="flyTo">flyTo 奥林匹克公园</button>
      <button class="btn" @click="showOverlays = !showOverlays">
        {{ showOverlays ? "移除" : "添加" }}覆盖物
      </button>
      <button class="btn" @click="openWindow = !openWindow">
        {{ openWindow ? "关闭" : "打开" }} InfoWindow
      </button>
      <button class="btn" @click="toggleLineTool">
        {{ activeTool === "line" ? "关闭" : "开启" }}测距工具
      </button>
      <button class="btn" @click="togglePolygonTool">
        {{ activeTool === "polygon" ? "关闭" : "开启" }}测面工具
      </button>
      <button class="btn" @click="showAnnoLayer = !showAnnoLayer">
        {{ showAnnoLayer ? "移除" : "叠加" }}注记瓦片层
      </button>
      <button class="btn" @click="startCarTrack">轨迹回放 start</button>
      <button class="btn" @click="pauseCarTrack">轨迹回放 pause</button>
    </div>
  </div>
</template>

<style>
.btn {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 8px;
  text-align: left;
}
.btn:hover {
  background: #f3f4f6;
}
</style>
