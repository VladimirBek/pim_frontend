<template>
  <div class="requests">
    <h3 class="requests-header">{{ header }}</h3>
    <div v-if="isFinancier" style="margin-bottom: 8px;">
      <v-tabs v-model="activeScope" density="compact">
        <v-tab value="my">Мои</v-tab>
        <v-tab value="finance">Финансовые</v-tab>
      </v-tabs>
    </div>
    <div class="requests-list__container">
      <div class="requests-table__container">
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
          <div v-for="(item, index) in displayRequests" :key="item.id_" class="requests-raw"
            :class="store.selectedRequest.id_ === item.id_ ? 'requests-raw--active' : ''"
            @click="selectRequest(item.id_)">
            <div
  v-for="(header, idx) in headers"
  :key="idx"
  class="requests-raw__item"
  :class="{
    'requests-raw__item--description': header.key === 'description'
  }"
  :style="{
    width: header.width ? header.width : 'auto',
    'max-width': header.maxWidth ? header.maxWidth : '',
  }"
  :title="header.key === 'description' ? getValue(item, header.key) : ''"
>
  {{ getValue(item, header.key) }}
</div>
          </div>
        </div>
      </div>
      <div style="min-width: 190px; padding-top: 4px;">
        <v-radio-group v-if="activeScope === 'my'" v-model="store.activeFilter" hide-details>
          <div v-for="filter in requestsFilters" :key="filter.id" class="requests-filter__list"
            @click="setFilter(filter)">
            <h3 style="width: 100%; line-height: 1;">
              {{ filter }}
            </h3>
            <v-radio :model-value="store.activeFilter" :value="filter"></v-radio>
          </div>
        </v-radio-group>
        <v-radio-group v-else v-model="store.activeFilter" hide-details>
          <div v-for="filter in finFilters" :key="filter.id" class="requests-filter__list" @click="setFilter(filter)">
            <h3 style="width: 100%; line-height: 1;">
              {{ filter }}
            </h3>
            <v-radio :model-value="store.activeFilter" :value="filter"></v-radio>
          </div>
        </v-radio-group>
      </div>
    </div>
    <div v-if="store.selectedRequest && store.selectedRequest.id_">
      <Request :is-detail="false" :is-edit="false" />
    </div>
    <v-snackbar v-model="store.alert" color="error" top>
      {{ store.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { dasStore } from '@/stores/das';

definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Все заявки',
    drawerIndex: 0,
  },
});

const store = dasStore();
const requestsFilters = ref([
  "МОИ ЗАЯВКИ",
  "СОГЛАСОВАТЬ",
  "НАБЛЮДАТЕЛЬ",
  "ВСЕ ЗАЯВКИ",
  "АРХИВ ЗАЯВОК"
]);
const finFilters = ref([
  "ВСЕ ЗАЯВКИ",
  "АРХИВ ЗАЯВОК"
]);

const selectedFilter = ref('Мои заявки');
const finansierIds = ["ab36d8b8-6f95-4e5d-90a3-7daa1c7e2ff0", "f357898b-7c17-4f78-b87c-904a00d4192b"];
const activeScope = ref('my')


const tableBody = ref(null);
const scrollbarWidth = ref(0);

const financeTypes = [
  'Компенсация ДС',
  'Компенсация командировочных расходов',
  'Выдача подотчётных ДС',
]

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

const getValue = (item, key) => {
  return key.split('.').reduce((acc, cur) => acc ? acc[cur] : '', item);
};

const isFinancier = computed(() => {
  const id = localStorage.getItem('id')
  return finansierIds.includes(String(id ?? ''))
})

const headers = computed(() => {
  const header = [
    { label: 'Дата', key: 'created_at_str', width: '64px' },
    { label: '№', key: 'number_str', width: '58px' },
    { label: 'Заявка', key: 'title', width: '480px' },
    { label: 'Инициатор', key: 'initiator.shortname', width: '150px' },
    { label: 'Статус', key: 'status', width: '136px' },
    { label: 'Согласовать до:', key: 'deadline_str', width: '100%', maxWidth: '214px' }
  ];
  const finHeaders = [
    { label: 'Дата', key: 'created_at_str', width: '64px' },
    { label: '№', key: 'number_str', width: '58px' }, {
      label: 'Описание',
      key: 'description',
      width: '480px',
      ellipsis: true,
      lines: 2
    },
    { label: 'Инициатор', key: 'initiator.shortname', width: '150px' },
    { label: 'Статус', key: 'status', width: '136px' },
    { label: 'Согласовать до:', key: 'deadline_str', width: '100%', maxWidth: '214px' }
  ]
  return activeScope.value === 'my' ? header : finHeaders
})



const isButtonAvailable = computed(() => {
  return store.selectedRequest.status !== 'Отозвано' && store.selectedRequest.status !== 'Отклонено' && store.selectedRequest.status !== 'Согласовано'
})


const displayRequests = computed(() => {
  const list = store.requestList || []
  const myId = String(localStorage.getItem('id') ?? '')
  if (!isFinancier.value) return list

  return list.filter(item => {
    const isFinanceType = financeTypes.includes(item.type)
    const isMy = String(item.initiator?.id_) === myId
    if (activeScope.value === 'finance') {
      return isFinanceType
    }
    return !isFinanceType || isMy
  })
})

const header = computed(() => {
  const filter = new Map([
    ['МОИ ЗАЯВКИ', 'Мои заявки'],
    ['СОГЛАСОВАТЬ', 'Согласовать'],
    ['НАБЛЮДАТЕЛЬ', 'Наблюдатель'],
    ['ВСЕ ЗАЯВКИ', 'Все заявки'],
    ['АРХИВ ЗАЯВОК', 'Архив заявок'],
  ]);

  return filter.get(store.activeFilter)
})

const setFilter = async (value) => {
  const filter = new Map([
    ['МОИ ЗАЯВКИ', 'by_initiator'],
    ['СОГЛАСОВАТЬ', 'by_approval'],
    ['НАБЛЮДАТЕЛЬ', 'by_observer'],
    ['ВСЕ ЗАЯВКИ', 'all'],
    ['АРХИВ ЗАЯВОК', 'archive'],
  ]);
  store.activeFilter = value;
  await store.getRequestsList(filter.get(value));

  nextTick(() => {
    updateScrollbarWidth();
  });
}

const selectRequest = (id) => {
  store.selectedRequest = store.requestList.find(el => el.id_ === id);
  store.getRequest(store.selectedRequest.number_str)
}

watch(activeScope, () => {
  if (store.selectedRequest?.id_ && !displayRequests.value.some(r => r.id_ === store.selectedRequest.id_)) {
    store.selectedRequest = {}
  }
})

watch(() => store.requestList, () => {
  nextTick(() => {
    updateScrollbarWidth();
  });
}, { deep: true });

onMounted(() => {
  window.addEventListener('resize', updateScrollbarWidth);
  setFilter(store.activeFilter);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollbarWidth);
});
</script>

<style lang="scss">
.requests {
  font-size: 18px;
  max-width: 1340px;

  &-list {
    &__container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
  }

  &-table {
    &__container {
      margin-right: 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      padding: 8px;
      padding-bottom: 16px;
    }

    &__body {
      overflow-y: auto;
      max-height: 240px;

      :hover {
        background-color: #b6b5b5;
      }
    }
  }

  &-headers {
    &__list {
      display: flex;
      width: 100%;
      font-family: 'Involve';
    }

    &__item {
      padding: 4px;
      border: 1px solid #b6b5b5;
      border-radius: 4px;
      width: 100%;
    }
  }

  &-raw {
    font-size: 14px;
    border: 1px solid #b6b5b5;
    border-radius: 4px;
    display: flex;
    padding: 4px 0;

    &--active {
      background-color: #b6b5b5;
    }

    &__item {
      padding-left: 4px;
      border-left: 2px solid #535353;
      width: 100%;

      min-height: 32px;
      max-height: 32px;
      display: flex;
      align-items: center;

      &:first-child {
        border-left: none;
      }
    }
  }

  &-filter {
    &__list {
      display: flex;
      align-items: center;
      max-height: 24px;
      min-width: 200px;
      margin-bottom: 12px;
      cursor: pointer;
    }
  }

  &-header {
    margin-bottom: 4px;
    font-family: 'Involve';
  }

  &-actions {
    display: flex;
    justify-content: end;
    width: 100%;

    :last-child {
      margin-right: 0;
    }

    &__btn {
      margin-right: 8px;
      min-width: 230px;
    }
  }
}


.requests-raw__item--description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px; // фиксированная высота
  line-height: 20px;
}
</style>
