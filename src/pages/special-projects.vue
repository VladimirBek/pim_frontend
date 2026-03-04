<template>
  <div class="das-container">
    <router-view />
  </div>
</template>
<script setup>

definePage({
  meta: {
    title: 'special-projects',
    drawerIndex: 0,
  },
})

</script>
<style lang="scss">
.das-container {
  padding: 16px;
}
</style>