<template>
  <div>
    <Edit
      :is-edit='isEdit'
      @toggle-is-edit="isEdit = true"
    />
  </div>
</template>

<script setup lang="ts">
import Edit from '@/components/product/Edit.vue'
import { ref } from 'vue';

const isEdit = ref(false)
</script>

<style scoped lang="scss"></style>