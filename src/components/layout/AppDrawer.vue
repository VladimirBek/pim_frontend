<template>
  <v-navigation-drawer class="drawer-container">
    <template #prepend>
      <div dense nav>
        <v-list-item class="pa-1">
          <div class="drawer-section__title">
            {{ activeSectionName }}
          </div>
        </v-list-item>
      </div>
    </template>
    <div nav density="compact" class="drawer-list">
      <AppDrawerItem v-for="item in availableItems" :key="item.name" :item="item" />
    </div>
    <v-spacer />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import sections from '@/helpers/sections';
import type { Section } from '@/helpers/sections'

const route = useRoute();
const lastActiveSection = ref<Section | null>(null);
const storedRoles = localStorage.getItem('roles');
const userRoles: string[] = storedRoles ? JSON.parse(storedRoles) : [];

const visibleSections = computed(() => {
  return Array.from(sections.values()).filter((section) => {
    if (!section.roles) return true;
    return section.roles.some((role) => userRoles.includes(role));
  });
});

const activeSectionData = computed(() => {
  const currentPath = route.path;
  const found = visibleSections.value.find(section =>
    currentPath === section.path ||
    section.subsections.some(sub =>
      currentPath === sub.path || currentPath.startsWith(sub.path + '/')
    )
  );
  if (found) {
    lastActiveSection.value = found;
    return found;
  }
  const parentSectionName = route.meta.parentSection as string | undefined;
  if (parentSectionName) {
    const parent = visibleSections.value.find(section => section.name === parentSectionName);
    if (parent) {
      lastActiveSection.value = parent;
      return parent;
    }
  }
  return lastActiveSection.value;
});

const availableItems = computed(() => {
  if (!activeSectionData.value) return [];
  if (activeSectionData.value.name !== 'Backoffice') {
    const items = [...activeSectionData.value.subsections];
    items.unshift({
      name: 'Backoffice',
      path: '/backoffice'
    });
    return items;
  } else {
    const visibleNames = visibleSections.value.map(sec => sec.name);
    return activeSectionData.value.subsections.filter(item =>
      visibleNames.includes(item.name)
    );
  }
});

const activeSectionName = computed(() => {
  return activeSectionData.value ? activeSectionData.value.name : ''
})

</script>


<style lang="scss">
.bg-primary {
  background-color: #000 !important;
}

.v-navigation-drawer {
  background-color: #F0F0F3 !important;

  &.v-navigation-drawer--rail {
    &.v-navigation-drawer--is-hovering {
      box-shadow: 0px 0px 6px 2px rgba(100, 100, 100, 0.6);
    }

    &:not(.v-navigation-drawer--is-hovering) {
      .drawer-footer {
        transform: translateX(-160px);
      }

      .v-list-group {
        --list-indent-size: 0px;
        --prepend-width: 0px;
      }
    }
  }

  .v-navigation-drawer__content {
    overflow-y: hidden;

    &:hover {
      overflow-y: overlay;
    }
  }

  .drawer-footer {
    transition: all 0.2s;
    min-height: 30px;

    div {
      white-space: nowrap;
    }

    &::after {
      min-height: 0;
    }
  }

  .v-list-group {
    // --list-indent-size: 10px;
    --prepend-width: 10px;
  }

  .v-list-item {
    transition: all 0.2s;
    color: #000;
  }

  .v-list-item--nav {
    transition: all 0.2s;
    color: #000;
  }

  .v-img__img--contain {
    object-fit: none;
  }
}

.drawer {
  &-section {
    &__title {
      padding-left: 20px;
      font-size: 36px;
    }
  }

  &-container {
    width: auto !important;
    min-width: 280px !important;
    position: relative !important;
  }

  &-list {
    margin: 8px;
    min-width: 240px;
    cursor: pointer;
  }
}
</style>
