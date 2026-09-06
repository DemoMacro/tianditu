<script setup lang="ts">
/**
 * 全局密钥管理面板：查看、修改、清除浏览器端密钥（tk）。
 * open 状态经 useState 共享，header 按钮与 demo 区入口都能打开。
 */
const open = useState("tdt-key-manager-open", () => false);

const { key, setKey } = useTdtKeys();
const toast = useToast();

const draft = ref("");

watchEffect(() => {
  draft.value = key.value;
});

function save() {
  const value = draft.value.trim();
  setKey(value);
  toast.add({
    title: value ? "密钥已保存" : "密钥已清除",
    color: "success",
    icon: "i-lucide-check",
  });
}

function clear() {
  draft.value = "";
  setKey("");
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="open"
      title="密钥（tk）"
      description="浏览器端密钥只保存在当前浏览器，不会上传"
    >
      <template #body>
        <UForm :state="{ draft }" class="flex flex-wrap items-center gap-2" @submit="save">
          <UInput
            v-model="draft"
            type="password"
            placeholder="浏览器端密钥（tk）"
            autocomplete="off"
            class="min-w-0 flex-1"
          />
          <UButton type="submit" icon="i-lucide-save">保存</UButton>
          <UButton
            v-if="key"
            color="neutral"
            variant="outline"
            icon="i-lucide-trash-2"
            @click="clear"
          >
            清除
          </UButton>
        </UForm>
        <p class="text-muted mt-3 text-xs">
          在天地图
          <NuxtLink
            to="https://console.tianditu.gov.cn/api/key"
            target="_blank"
            class="text-primary"
          >
            控制台
          </NuxtLink>
          申请，地图与服务示例共用。
        </p>
      </template>
    </UModal>
  </ClientOnly>
</template>
