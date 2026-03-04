<template>
    <div>
        <router-view/>
    </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    title: 'Работа с блогерами',
    icon: 'mdi-account-supervisor-outline',
    drawerIndex: 3,
    breadcrumb: 'disabled',
  },
})
</script>

<style scoped>

</style>