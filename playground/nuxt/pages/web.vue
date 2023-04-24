<script setup>
import { defineTianditu } from "@tianditu/api";
const config = useRuntimeConfig();

const tianditu = defineTianditu({
  key: `${config.public.tianditu.browserKey}`,
});
</script>

<template>
  <div></div>
</template>
