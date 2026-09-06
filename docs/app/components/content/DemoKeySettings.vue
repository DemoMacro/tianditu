<script setup lang="ts">
/**
 * live 示例的密钥输入面板。type 区分两类密钥：
 * browser — 浏览器端密钥（地图展示用）；server — 服务器端密钥（服务接口用）。
 * 保存到 localStorage 后，同页与跨页的 live 示例即时生效。
 */
const props = defineProps<{
  type: "browser" | "server";
  /** 紧凑模式：demo 区内嵌时的标题省略 */
  compact?: boolean;
}>();

const { browserKey, serverKey, setBrowserKey, setServerKey } = useTdtKeys();

const current = computed(() => (props.type === "browser" ? browserKey : serverKey));
const draft = ref("");
const saved = ref(false);

watchEffect(() => {
  draft.value = current.value.value;
});

const label = computed(() =>
  props.type === "browser" ? "浏览器端密钥（tk）" : "服务器端密钥（tk）",
);
const hint = computed(() =>
  props.type === "browser"
    ? "用于地图 JS API 展示，在天地图控制台申请浏览器端密钥"
    : "用于 REST 服务接口，在天地图控制台申请服务器端密钥",
);

function save() {
  saved.value = true;
  props.type === "browser" ? setBrowserKey(draft.value.trim()) : setServerKey(draft.value.trim());
  setTimeout(() => (saved.value = false), 1500);
}

function clear() {
  draft.value = "";
  props.type === "browser" ? setBrowserKey("") : setServerKey("");
}
</script>

<template>
  <div class="border-muted bg-elevated/50 rounded-(--ui-radius) border p-4">
    <p v-if="!compact" class="mb-1 font-medium">{{ label }}</p>
    <p class="text-muted mb-3 text-sm">{{ hint }}</p>
    <form class="flex flex-wrap gap-2" @submit.prevent="save">
      <input
        v-model="draft"
        type="password"
        :placeholder="`${label}…`"
        autocomplete="off"
        class="border-muted bg-default focus:ring-primary min-w-0 flex-1 rounded-(--ui-radius) border px-3 py-1.5 text-sm outline-none focus:ring-2"
      />
      <button
        type="submit"
        class="bg-primary text-inverted rounded-(--ui-radius) px-3 py-1.5 text-sm"
      >
        {{ saved ? "已保存 ✓" : "保存" }}
      </button>
      <button
        v-if="current.value"
        type="button"
        class="border-muted rounded-(--ui-radius) border px-3 py-1.5 text-sm"
        @click="clear"
      >
        清除
      </button>
    </form>
  </div>
</template>
