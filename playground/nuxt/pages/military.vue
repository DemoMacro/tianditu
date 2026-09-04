<script setup>
import {
  TdtControlMilitarySymbols,
  TdtCurveFlag,
  TdtDoubleArrow,
  TdtGatheringPlace,
  TdtMap,
  TdtStraightArrow,
  TdtStraightArrowTool,
} from "@tianditu/vue";

const config = useRuntimeConfig();
const tk = config.public.tianditu.browserKey;

const center = ref([116.38, 39.92]);
const zoom = ref(11);
const drawing = ref(false);

const arrowPath = [
  [116.32, 39.98],
  [116.36, 39.96],
  [116.4, 39.97],
];
const doubleArrowPath = [
  [116.42, 39.86],
  [116.44, 39.88],
  [116.46, 39.86],
  [116.48, 39.89],
];
const gatheringPath = [
  [116.34, 39.86],
  [116.35, 39.87],
  [116.36, 39.855],
];
const flagPath = [
  [116.44, 39.94],
  [116.46, 39.95],
  [116.47, 39.94],
];
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1">
      <TdtMap :tk="tk" :center="center" :zoom="zoom" style="width: 100%; height: 100%">
        <TdtControlMilitarySymbols position="topleft" />

        <TdtStraightArrowTool
          :active="drawing"
          @click="(e) => console.log('[military] click', e.currentLnglats)"
          @dbclick="(e) => console.log('[military] dbclick finish', e.currentLayer)"
        />

        <TdtStraightArrow :path="arrowPath" color="#dc2626" :weight="5" :opacity="0.8" />
        <TdtDoubleArrow
          :path="doubleArrowPath"
          color="#2563eb"
          fill-color="#2563eb"
          :fill-opacity="0.4"
        />
        <TdtGatheringPlace
          :path="gatheringPath"
          color="#16a34a"
          fill-color="#16a34a"
          :fill-opacity="0.35"
        />
        <TdtCurveFlag :path="flagPath" color="#ca8a04" fill-color="#ca8a04" :fill-opacity="0.4" />
      </TdtMap>
    </div>

    <div class="flex w-72 flex-col gap-2 overflow-auto p-4">
      <h1 class="font-bold">标绘演示</h1>
      <p class="text-sm text-gray-500">
        左上角为官方 ControlMilitarySymbols 工具条；静态标号为组件式声明。
      </p>
      <NuxtLink to="/" class="btn">← 返回主页</NuxtLink>
      <button class="btn" @click="drawing = !drawing">
        {{ drawing ? "关闭" : "开启" }}直箭头绘制工具
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
