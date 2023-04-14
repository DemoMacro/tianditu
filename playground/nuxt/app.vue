<script setup>
const config = useRuntimeConfig();
</script>

<template>
  <div style="height: 100vh; width: 100%">
    <t-map
      :tk="config.public.tianditu.browserKey"
      id="mapDiv"
      style="display: block; height: 100%; width: 100%"
    ></t-map>
  </div>
</template>
