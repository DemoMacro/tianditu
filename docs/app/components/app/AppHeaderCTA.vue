<script setup lang="ts">
/**
 * 覆盖 docus 同名组件：header 右侧提供全局密钥管理入口。
 */
const open = useState("tdt-key-manager-open", () => false);
</script>

<template>
  <ClientOnly>
    <UButton
      icon="i-lucide-key-round"
      color="neutral"
      variant="ghost"
      aria-label="密钥（tk）"
      title="密钥（tk）"
      @click="open = true"
    />
    <template #fallback>
      <div class="h-8 w-8" />
    </template>
    <AppKeyManager />
  </ClientOnly>
</template>
