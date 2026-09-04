<script setup>
import { defineTianditu } from "@tianditu/services";

const config = useRuntimeConfig();
const tk = config.public.tianditu.browserKey;

const tianditu = defineTianditu({ tk });

const keyword = ref("北京站");
const result = ref();
const error = ref();
const loading = ref(false);

async function search() {
  loading.value = true;
  error.value = undefined;
  try {
    result.value = await tianditu.search({
      keyWord: keyword.value,
      // 地名搜索V2.0：普通搜索（含地铁公交）
      queryType: 1,
      start: 0,
      count: 10,
    });
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="font-bold">@tianditu/services 本地搜索</h1>
    <form class="flex gap-2" @submit.prevent="search">
      <input v-model="keyword" class="rounded border px-2 py-1" placeholder="关键词" />
      <button class="rounded border px-3" :disabled="loading">
        {{ loading ? "搜索中…" : "搜索" }}
      </button>
    </form>
    <pre class="max-h-96 overflow-auto rounded bg-gray-100 p-3 text-xs">{{
      error ?? result ?? "输入关键词并搜索"
    }}</pre>
  </div>
</template>
