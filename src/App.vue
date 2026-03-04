<script setup lang="ts">
import { THEME_KEY } from 'vue-echarts'
const theme = useTheme()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined))
)
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
/* .v-field__input {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 38px;
  font-size: 14px;
  display: flex;
  align-items: center;
}; */
.v-input__details {
  min-height: none;
  padding-top: 4px;
};
.v-field__input > input {
  align-self: center;
}
</style>
