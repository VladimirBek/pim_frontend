<template>
  <div class="cms-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    icon: 'mdi-file-document-outline',
    title: 'CMS',
    drawerIndex: 0,
  },
});
</script>

<style scoped lang="scss">
.cms-container {
  padding: 16px;
}
</style>
