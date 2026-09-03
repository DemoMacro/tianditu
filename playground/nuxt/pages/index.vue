<script setup>
import {
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
  TdtRectangle,
  useMap,
} from "@tianditu/vue";

const config = useRuntimeConfig();
const tk = config.public.tianditu.browserKey;

const center = ref([116.404, 39.915]);
const zoom = ref(12);
const showOverlays = ref(true);
const openWindow = ref(false);
const mapRef = ref();

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
