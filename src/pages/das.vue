<template>
  <div class="das-container">
    <router-view/>
  </div>
</template>
<script setup>
import { dasStore } from '@/stores/das';

definePage({
    meta: {
        icon: 'mdi-home',
        title: 'DAS',
        drawerIndex: 0,
    },
})

const route = useRoute();
const store = dasStore();

onMounted(async () => {
  if (route.name.includes('requests')) {
    await store.getRequestsList('all')
  }
})
</script>
<style lang="scss">
    .das-container {
      padding: 16px;
    }
</style>