<!-- src/views/SearchResultsView.vue -->
<template>
  <div class="search-container">

    <div v-if="store.filtredRequests.length === 0 && !store.searchQuery"  class="observer-target">
      <h2 class="search-header">Поиск</h2>
      <p class="mt-4">
        Заполните поле поиска
      </p>
    </div>
    <div v-else-if="store.filtredRequests.length === 0 && store.searchQuery"  class="observer-target">
      <h2 class="search-header">Результаты поиска</h2>
      <p class="mt-4">
        Соответствующих заявок не найдено
      </p>
        <div style="margin-top: 6px;">
          <v-btn class="button-secondary request-actions__button" @click="router.back()">Назад</v-btn>
        </div>
    </div>
    <div v-else class="requests">
      <h2 class="search-header">Результаты поиска</h2>
      <div class="requests-list__container">
        <div class="requests-table__container" style="max-width: 1134px;">
          <div class="requests-headers__list" :style="{ 'padding-right': scrollbarWidth + 'px' }">
            <div v-for="(header, index) in headers" :key="index" class="requests-headers__item" :style="{
              width: header.width ? header.width : 'auto',
              'max-width': header.maxWidth ? header.maxWidth : '',
            }">
              <slot :name="header.key" :value="header.label">
                <h3 style="font-size: 18px;">
                  {{ header.label }}
                </h3>
              </slot>
            </div>
          </div>
          <div class="requests-table__body" ref="tableBody">
            <div v-for="(item, index) in store.filtredRequests" :key="item.id_" class="requests-raw"
              :class="selectedRequest && selectedRequest.id_ === item.id_ ? 'requests-raw--active' : ''"
              @click="selectRequest(item.id_)">
              <div v-for="(header, idx) in headers" :key="idx" class="requests-raw__item" :style="{
                width: header.width ? header.width : 'auto',
                'max-width': header.maxWidth ? header.maxWidth : '',
              }">
                <slot :name="header.key" :value="getValue(item, header.key)">
                  {{ getValue(item, header.key) }}
                </slot>
              </div>
            </div>
          </div>
        </div>
        <!-- <div style="min-width: 190px; padding-top: 4px;">
          <v-radio-group v-model="store.activeFilter" hide-details>
            <div v-for="filter in requestsFilters" :key="filter.id" class="requests-filter__list"
              @click="setFilter(filter)">
              <h3 style="width: 100%; line-height: 1;">
                {{ filter }}
              </h3>
              <v-radio :model-value="store.activeFilter" :value="filter"></v-radio>
            </div>
          </v-radio-group>
        </div> -->
      </div>
      <div v-if="selectedRequest && selectedRequest.id_">
        <Request :is-detail="false" />
      </div>
      <div class="requests-actions">
        <v-btn v-if="selectedRequest && selectedRequest.id_" class="button requests-actions__btn"
          @click="router.push(`/das/request/${selectedRequest.number_str}`)">
          Детали заявки
        </v-btn>
      </div>
      <v-snackbar v-model="store.alert" color="error" top>
        {{ store.message }}
      </v-snackbar>
    </div>
  </div>
  <!-- <div v-else-if="isLoading" class="text-center py-4">
      <v-progress-circular indeterminate></v-progress-circular>
    </div> -->

  <!-- <div v-else class="empty-results">
      <p>По вашему запросу ничего не найдено</p>
    </div> -->
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { searchStore } from '@/stores/search'
import { dasStore } from '@/stores/das'

const route = useRoute();
const router = useRouter();
const store = searchStore();
const das = dasStore();

const currentPage = ref(1)
const hasMoreResults = ref(true)
const selectedRequest = ref(null);
const tableBody = ref(null);

const isLoading = computed(() => {
  return store.filtredRequests.length === 0 && selectedRequest.value && selectedRequest.value.id_;
})
const totalResults = computed(() => store.filtredRequests.length)

const requestsFilters = ref([
  "МОИ ЗАЯВКИ",
  "СОГЛАСОВАТЬ",
  "НАБЛЮДАТЕЛЬ",
  "ВСЕ ЗАЯВКИ",
  "АРХИВ ЗАЯВОК"
]);
const scrollbarWidth = ref(0);

const getValue = (item, key) => {
  return key.split('.').reduce((acc, cur) => acc ? acc[cur] : '', item);
};
const updateScrollbarWidth = () => {
  if (tableBody.value) {
    const hasVerticalScrollbar = tableBody.value.scrollHeight > tableBody.value.clientHeight;
    if (hasVerticalScrollbar) {
      scrollbarWidth.value = tableBody.value.offsetWidth - tableBody.value.clientWidth;
    } else {
      scrollbarWidth.value = 0;
    }
  }
};
const headers = ref([
  { label: 'Дата', key: 'created_at_str', width: '64px' },
  { label: '№', key: 'number_str', width: '58px' },
  { label: 'Заявка', key: 'title', width: '480px' },
  { label: 'Инициатор', key: 'initiator.shortname', width: '150px' },
  { label: 'Статус', key: 'status', width: '136px' },
  { label: 'Согласовать до:', key: 'deadline_str', width: '100%', maxWidth: '195px' }
]);

const selectRequest = (id) => {
  selectedRequest.value = store.filtredRequests.find(el => el.id_ === id);
  das.selectedRequest = store.filtredRequests.find(el => el.id_ === id);
  das.getComments(id)
}

const setFilter = async (value) => {
  const filter = new Map([
    ['МОИ ЗАЯВКИ', 'by_initiator'],
    ['СОГЛАСОВАТЬ', 'by_approval'],
    ['НАБЛЮДАТЕЛЬ', 'by_observer'],
    ['ВСЕ ЗАЯВКИ', 'all'],
    ['АРХИВ ЗАЯВОК', 'archive'],
  ]);
  das.activeFilter = value;
  nextTick(() => {
    updateScrollbarWidth();
  });
}
watch(() => store.filtredRequests, () => {
  selectedRequest.value = store.filtredRequests[0];
  das.selectedRequest = store.filtredRequests[0];
  nextTick(() => {
    updateScrollbarWidth();
  });
}, { deep: true });

onMounted(() => {
  window.addEventListener('resize', updateScrollbarWidth);
  // setFilter(das.activeFilter);
  // if (store.filtredRequests.length > 0) {
  //   selectedRequest.value = store.filtredRequests[0]
  // }
});


onUnmounted(() => {
  window.removeEventListener('resize', updateScrollbarWidth);
});
</script>

<style lang="scss" scoped>
.search {
  &-container {
    font-family: 'Involve';
    max-width: 1340px;
  }
}


.empty-results {
  padding: 48px 0;

  .v-icon {
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 16px;
    font-size: 18px;
    color: #757575;
  }
}

.observer-target {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  min-height: 60px;
}
</style>
