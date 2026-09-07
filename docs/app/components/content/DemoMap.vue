<script setup lang="ts">
import { TdtMap } from "@tianditu/vue";

/**
 * MDC live 地图示例：::DemoMap{center="116.404,39.915" zoom="12"}
 * 未传 center 时自动定位（浏览器优先、IP 兜底）；未保存密钥时展示引导卡；
 * 密钥变更经 :key 重建地图。
 */
const props = defineProps<{
  /** "lng,lat" */
  center?: string;
  /** MDC attribute 以字符串传入 */
  zoom?: number | string;
}>();

const appConfig = useAppConfig();
const { key } = useTdtKeys();
const keyManagerOpen = useState("tdt-key-manager-open", () => false);

const center = computed<[number, number] | undefined>(() => {
  if (props.center) {
    return props.center.split(",").map(Number) as [number, number];
  }
  return undefined;
});

const zoom = computed(() => Number(props.zoom ?? appConfig.tdt.defaultZoom));
</script>

<template>
  <ClientOnly>
    <DemoKeySettings v-if="!key" compact />
    <div v-else class="tdt-demo relative">
      <TdtMap :key="key" :tk="key" :center="center" :zoom="zoom" locate="auto">
        <slot />
      </TdtMap>
      <UButton
        class="absolute right-2 bottom-2 z-10"
        size="xs"
        color="neutral"
        variant="solid"
        icon="i-lucide-key-round"
        label="密钥"
        title="修改密钥"
        @click="keyManagerOpen = true"
      />
    </div>
    <template #fallback>
      <div class="tdt-demo text-muted grid place-items-center text-sm">地图加载中…</div>
    </template>
  </ClientOnly>
</template>
