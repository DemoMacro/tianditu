<script setup lang="ts">
/**
 * live 示例的密钥输入面板。保存到 localStorage 后，同页与跨页的 live 示例即时生效。
 */
const props = defineProps<{
  /** 紧凑模式：demo 区内嵌时的标题省略 */
  compact?: boolean;
}>();

const { key, draft, save, clear } = useTdtKeyDraft();
</script>

<template>
  <div class="border-muted bg-elevated/50 rounded-(--ui-radius) border p-4">
    <p v-if="!compact" class="mb-1 font-medium">浏览器端密钥（tk）</p>
    <p class="text-muted mb-3 text-sm">
      本站示例均在浏览器中运行，使用天地图控制台申请的浏览器端密钥，地图与服务示例共用。
    </p>
    <UForm :state="{ draft }" class="flex flex-wrap items-center gap-2" @submit="save">
      <UInput
        v-model="draft"
        type="password"
        placeholder="浏览器端密钥（tk）…"
        autocomplete="off"
        class="min-w-0 flex-1"
      />
      <UButton type="submit" icon="i-lucide-save">保存</UButton>
      <UButton v-if="key" color="neutral" variant="outline" icon="i-lucide-trash-2" @click="clear">
        清除
      </UButton>
    </UForm>
  </div>
</template>
