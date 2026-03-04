<template>
  <v-list-item class="drawer-item" :class="{ 'drawer-item--active': isActive }" :to="item.path" :title="item.name">
  </v-list-item>
</template>
<script setup lang="ts">
import type { Subsection } from '@/helpers/sections'


const route = useRoute()

const props = withDefaults(defineProps<{ level?: number; item: Subsection }>(), {
  level: 0,
})

const isActive = computed(() => {
  return route.path === props.item.path || route.path.startsWith(props.item.path + '/')
})
</script>

<style lang="scss">
.drawer {
  &-item {
    background-color: none;
    color: #000;
    font-size: 16px !important;
    border-radius: 0;
    font-size: 20px;

    &:hover {
      background-color: #b6b5b5;
    }

    &--active {
      border-left: 4px solid #000;
    }
  }
}
</style>
