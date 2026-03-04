<template>
  <div class="backoffice-container">
    <div v-for="item in availableItems" :key="item.name" class="backoffice-section" @click="router.push(item.path)">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import sections from '@/helpers/sections';
import router from '@/plugins/router';

definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Backoffice',
    drawerIndex: 0,
  },
});

const storedRoles = localStorage.getItem('roles');
const userRoles: string[] = storedRoles ? JSON.parse(storedRoles) : [];

const visibleSections = computed(() => {
  return Array.from(sections.values()).filter((section) => {
    if (!section.roles) return true;
    return section.roles.some((role) => userRoles.includes(role));
  });
});

const availableItems = computed(() => {
  const section = sections.get("Backoffice");
  if (!section) {
    return []
  } else {
    const visibleNames = visibleSections.value.map(sec => sec.name);
    return section.subsections.filter(item => visibleNames.includes(item.name) && item.name !== 'Backoffice');
  }
})

</script>

<style lang="scss" scoped>
.backoffice {
  &-container {
    display: flex;
    padding: 24px;
  }
  &-section {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 220px;
    min-height: 220px;
    width: 100%;
    height: 100%;
    margin-right: 24px;
    background-color: #000;
    font-size: 32px;
    color: #fff;
    text-align: center;
    box-shadow: 8px 5px 5px #b6b5b5;
    cursor: pointer;
  }
}
</style>
