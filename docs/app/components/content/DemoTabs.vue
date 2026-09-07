<script lang="ts">
import type { VNode } from "vue";
</script>

<script setup lang="ts">
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "reka-ui";
import { computed, ref, onBeforeUpdate } from "vue";

/**
 * MDC 写法切换示例（设计参照 DemoMacro/office-open 的 ApiExample）：
 *
 * :::demo-tabs
 * ```vue [Vue]
 * <TdtMarker :lnglat="[116.404, 39.915]" />
 * ```
 * ```html [Web Components]
 * <tdt-marker lnglat="116.404,39.915"></tdt-marker>
 * ```
 * :::
 *
 * slot 里的每个带标签代码块渲染为一个 tab，标签取代码块标签（filename），
 * 切换不销毁（unmount-on-hide false），保持各写法的滚动与选择状态。
 */

const slots = defineSlots<{ default(props?: {}): VNode[] }>();
const model = defineModel<string>();
const rerenderCount = ref(0);

const items = computed(() => {
  rerenderCount.value;
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || [];
});

function transformSlot(slot: any, index: number): any {
  if (typeof slot.type === "symbol") {
    return slot.children?.map(transformSlot);
  }
  return {
    label: slot.props?.filename || `${index}`,
    component: slot,
  };
}

onBeforeUpdate(() => rerenderCount.value++);
</script>

<template>
  <TabsRoot
    v-model="model"
    default-value="0"
    :unmount-on-hide="false"
    class="group relative my-5 *:not-first:static! *:not-first:my-0!"
  >
    <TabsList
      class="border-muted bg-default relative flex items-center gap-1 overflow-x-auto rounded-t-md border border-b-0 p-2"
    >
      <TabsIndicator
        class="bg-elevated absolute inset-y-2 left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-md shadow-xs transition-[translate,width] duration-200"
      />

      <TabsTrigger
        v-for="(item, index) of items"
        :key="index"
        :value="String(index)"
        class="text-default data-[state=active]:text-highlighted hover:bg-elevated/50 relative inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
      >
        <span class="truncate">{{ item.label }}</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="(item, index) of items" :key="index" :value="String(index)" as-child>
      <component :is="item.component" hide-header tabindex="-1" />
    </TabsContent>
  </TabsRoot>
</template>
