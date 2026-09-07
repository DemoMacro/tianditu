<script setup lang="ts">
import { defineTianditu, type SearchResult } from "@tianditu/services";

/**
 * MDC live 服务示例：::DemoService（本地搜索 V2.0）
 * 未保存密钥时展示引导卡；搜索经 @tianditu/services 直连 REST。
 */
const { key } = useTdtKeys();
const { tdt } = useAppConfig();
const keyManagerOpen = useState("tdt-key-manager-open", () => false);

// 普通搜索（queryType:1）在 V2.0 接口下同样必填视野参数，以默认视图构造
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
    result.value = await defineTianditu({ tk: key.value }).search({
      keyWord: keyword.value,
      // 地名搜索V2.0：普通搜索（含地铁公交）
      queryType: 1,
      level: tdt.defaultZoom,
      mapBound,
      start: 0,
      count: 10,
    });
  } catch {
    error.value = "请求失败：请检查密钥与网络";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col gap-3">
      <DemoKeySettings v-if="!key" compact />
      <template v-else>
        <UForm :state="{ keyword }" class="flex items-center gap-2" @submit="search">
          <UInput v-model="keyword" placeholder="关键词，如 北京站" class="min-w-0 flex-1" />
          <UButton type="submit" icon="i-lucide-search" :loading="loading">搜索</UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-key-round"
            aria-label="修改密钥"
            title="修改密钥"
            @click="keyManagerOpen = true"
          />
        </UForm>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="error"
        />
        <UAlert
          v-else-if="result && result.status.infocode !== 1000"
          color="neutral"
          variant="subtle"
          icon="i-lucide-info"
          :title="`未返回数据：${result.status.cndesc}`"
        />

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
