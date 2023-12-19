<script setup>
const config = useRuntimeConfig();

const center = ref([0, 0]);
const zoom = ref(18);

navigator.geolocation.getCurrentPosition(
  (position) => {
    center.value = [position.coords.longitude, position.coords.latitude];
  },
  null,
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
);

useHead({
  script: [
    {
      src: `https://api.tianditu.gov.cn/api?v=4.0&tk=${config.public.tianditu.browserKey}`,
    },
  ],
});
</script>

<template>
  <div class="h-screen">
    <tdt-map
      :tk="config.public.tianditu.browserKey"
      :center="center"
      :zoom="zoom"
    >
      <tdt-control-zoom />
      <tdt-control-scale />
      <tdt-control-copyright />
      <tdt-control-overview-map />
    </tdt-map>
  </div>
</template>
