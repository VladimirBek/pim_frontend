<template>
    <Request :is-detail="true" :is-edit="false"/>
    <v-snackbar
    v-model="store.alert"
    color="error"
    top
  >
    {{ store.message }}
  </v-snackbar>
</template>
<script setup>
import { dasStore } from '@/stores/das';
definePage({
  meta: {
    parentSection: 'DAS'
  },
})

const store = dasStore();

onMounted(() => {
  store.getRequest()
})

// onUpdated(() => {
//   store.getRequest()
// })

</script>
<style lang="scss">

</style>
