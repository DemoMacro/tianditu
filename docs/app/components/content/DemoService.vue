<script setup lang="ts">
import { defineTianditu, type SearchResult } from "@tianditu/services";

/**
 * MDC live 服务示例：::DemoService（本地搜索 V2.0）
 * 未保存服务器端密钥时展示引导卡；搜索经 @tianditu/services 直连 REST。
 */
const { serverKey } = useTdtKeys();
const { tdt } = useAppConfig();

// 普通搜索（queryType:1）在 V2.0 接口下同样必填视野参数，以缺省视图构造
const [lng, lat] = tdt.defaultCenter;
const mapBound = [lng - 0.32, lat - 0.26, lng + 0.32, lat + 0.26].join(",");

const keyword = ref("北京站");
const result = ref<SearchResult>();
const error = ref<string>();
const loading = ref(false);

async function search() {
  loading.value = true;
  error.value = undefined;
  result.value = undefined;
  try {
    result.value = await defineTianditu({ tk: serverKey.value }).search({
      keyWord: keyword.value,
      // 地名搜索V2.0：普通搜索（含地铁公交）
      queryType: 1,
      level: tdt.defaultZoom,
      mapBound,
      start: 0,
      count: 10,
    });
  } catch {
    error.value = "请求失败：请检查服务器端密钥与网络";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col gap-3">
      <DemoKeySettings v-if="!serverKey" type="server" compact />
      <template v-else>
        <form class="flex gap-2" @submit.prevent="search">
          <input
            v-model="keyword"
            placeholder="关键词，如 北京站"
            class="border-muted bg-default focus:ring-primary min-w-0 flex-1 rounded-(--ui-radius) border px-3 py-1.5 text-sm outline-none focus:ring-2"
          />
          <button
            type="submit"
            :disabled="loading"
            class="bg-primary text-inverted rounded-(--ui-radius) px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {{ loading ? "搜索中…" : "搜索" }}
          </button>
        </form>

        <p v-if="error" class="text-error text-sm">{{ error }}</p>
        <p v-else-if="result && result.status.infocode !== 1000" class="text-muted text-sm">
          未返回数据：{{ result.status.cndesc }}
        </p>

        <table v-if="result?.pois?.length" class="w-full text-sm">
          <thead>
            <tr class="border-muted text-muted border-b text-left">
              <th class="py-1.5 pr-3 font-medium">名称</th>
              <th class="py-1.5 pr-3 font-medium">地址</th>
              <th class="py-1.5 font-medium">坐标</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="poi in result.pois"
              :key="poi.lonlat"
              class="border-muted border-b last:border-0"
            >
              <td class="py-1.5 pr-3">{{ poi.name }}</td>
              <td class="py-1.5 pr-3">{{ poi.address ?? "—" }}</td>
              <td class="py-1.5 font-mono text-xs">{{ poi.lonlat }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
    <template #fallback>
      <div class="text-muted text-sm">服务示例加载中…</div>
    </template>
  </ClientOnly>
</template>
