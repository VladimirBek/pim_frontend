<template>
  <v-alert
    v-if="!isProd"
    title="Важно"
    type="warning"
    closable
    class="env-alert"
    :style="currentRouteName !== '/login' ? 'top: 80px' : 'top: 20px'"
  >
    Добрый день!
    Вы находитесь в тестовом окружении.
    Для корректной работы backoffice вам необходимо перейти по ссылке
    <a href="http://backoffice.integraaal.com/das/requests">http://backoffice.integraaal.com/das/requests</a>
  </v-alert>

  <div class="layout">
    <AppDrawer v-if="currentRouteName !== '/login'" class="layout__drawer" />
    <div class="layout__main">
      <AppBar v-if="currentRouteName !== '/login'" class="layout__appbar" />
      <main class="layout__content" :class="currentRouteName !== '/login' ? 'layout__content--inner' : ''">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const route = useRoute()

const title = computed(() => {
  const t = route.meta?.title || route.matched[0].meta?.title || ''
  return t ? `${t} | Integraaal` : 'Integraaal'
})

const currentRouteName = computed(() => {
  return route.name as any
})

const isProd = computed(() => {
  return import.meta.url.startsWith('http://backoffice.integraaal.com')
})

useTitle(title)
</script>

<style lang="scss">
.layout {
  display: flex;
  height: 100%;

  &__drawer {
    background-color: #f5f5f5;
    min-width: 200px;
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__appbar {
    height: 64px;
    flex-shrink: 0;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }
}

/* Важно: поверх ВСЕГО UI */
.env-alert {
  position: fixed !important;
  right: 24px;
  z-index: 4000 !important;
  width: 560px;
  max-width: calc(100vw - 48px);
}
</style>
