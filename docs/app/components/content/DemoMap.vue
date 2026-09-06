<script setup lang="ts">
import { TdtMap, TdtMarker } from "@tianditu/vue";

/**
 * MDC live 地图示例：::DemoMap{center="116.404,39.915" zoom="12"}
 * 未保存浏览器端密钥时展示引导卡；密钥变更经 :key 重建地图。
 */
const props = defineProps<{
  /** "lng,lat" */
  center?: string;
  /** MDC attribute 以字符串传入 */
  zoom?: number | string;
}>();

const appConfig = useAppConfig();
const { browserKey } = useTdtKeys();

const center = computed<[number, number]>(() => {
  if (props.center) {
    return props.center.split(",").map(Number) as [number, number];
  }
  return appConfig.tdt.defaultCenter;
});

const zoom = computed(() => Number(props.zoom ?? appConfig.tdt.defaultZoom));
</script>

<template>
  <ClientOnly>
    <DemoKeySettings v-if="!browserKey" type="browser" compact />
    <div v-else class="tdt-demo">
      <TdtMap :key="browserKey" :tk="browserKey" :center="center" :zoom="zoom">
        <TdtMarker :lnglat="center" />
      </TdtMap>
    </div>
    <template #fallback>
      <div class="tdt-demo text-muted grid place-items-center text-sm">地图加载中…</div>
    </template>
  </ClientOnly>
</template>
