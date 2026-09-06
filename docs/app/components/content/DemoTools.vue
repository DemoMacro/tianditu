<script setup lang="ts">
import {
  TdtCircleTool,
  TdtMap,
  TdtMarker,
  TdtPolygonTool,
  TdtPolylineTool,
  TdtRectangleTool,
} from "@tianditu/vue";

/**
 * MDC live 工具示例：::DemoTools
 * 按钮切换四种绘制工具；未保存密钥时展示引导卡。
 */
const { key } = useTdtKeys();
const keyManagerOpen = useState("tdt-key-manager-open", () => false);
const appConfig = useAppConfig();

const TOOLS = [
  { key: "polyline", label: "测距", component: TdtPolylineTool },
  { key: "polygon", label: "测面", component: TdtPolygonTool },
  { key: "circle", label: "圆", component: TdtCircleTool },
  { key: "rectangle", label: "矩形", component: TdtRectangleTool },
] as const;

const active = ref<string>("");

function toggle(key: string) {
  active.value = active.value === key ? "" : key;
}
</script>

<template>
  <ClientOnly>
    <DemoKeySettings v-if="!key" compact />
    <div v-else class="tdt-demo relative">
      <TdtMap
        :key="key"
        :tk="key"
        :center="appConfig.tdt.defaultCenter"
        :zoom="appConfig.tdt.defaultZoom + 1"
      >
        <TdtMarker :lnglat="appConfig.tdt.defaultCenter" />
        <component
          :is="tool.component"
          v-for="tool in TOOLS"
          :key="tool.key"
          :active="active === tool.key"
        />
      </TdtMap>
      <div class="absolute top-2 left-2 flex gap-1">
        <UButton
          v-for="tool in TOOLS"
          :key="tool.key"
          size="xs"
          :color="active === tool.key ? 'primary' : 'neutral'"
          :variant="active === tool.key ? 'solid' : 'soft'"
          :label="tool.label"
          @click="toggle(tool.key)"
        />
      </div>
      <UButton
        class="absolute right-2 bottom-2"
        size="xs"
        color="neutral"
        variant="solid"
        icon="i-lucide-key-round"
        label="密钥"
        @click="keyManagerOpen = true"
      />
    </div>
    <template #fallback>
      <div class="tdt-demo text-muted grid place-items-center text-sm">示例加载中…</div>
    </template>
  </ClientOnly>
</template>
