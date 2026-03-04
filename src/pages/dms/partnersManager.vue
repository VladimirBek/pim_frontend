<template>
  <div>
    <div class="partner-search">
      <v-text-field v-model.trim="search" append-inner-icon="mdi-magnify" label="Поиск" single-line hide-details
        density="compact" variant="outlined" @update:model-value="onSearchInput" />
    </div>

    <v-data-table-server :headers="headers" :items="partners" :items-length="totalItems"
    :items-per-page-options="[10, 25, 50, 100]" :loading="loading"
      v-model:page="page" v-model:items-per-page="itemsPerPage" @update:options="onUpdateOptions"
      @click:row="onRowClick" />
  </div>
</template>

<script setup lang="ts">
import { restApi } from '@/restApi/restMethods.vue'
import { partnerStore } from '@/stores/partner'
import router from '@/plugins/router'

definePage({
  meta: {
    title: 'Контрагенты менеджеров',
    icon: 'mdi-handshake-outline',
    drawerIndex: 3,
  },
})

const store = partnerStore()

const headers = ref([
  { title: 'Фамилия', key: 'f' },
  { title: 'Имя', key: 'i' },
  { title: 'Отчество', key: 'o' },
  { title: 'ИНН', key: 'inn' },
  { title: 'ОГРНИП', key: 'ogrnip' },
  { title: 'Телефон', key: 'phones[0]' },
  { title: 'Email', key: 'emails[0]' },
  { title: 'Ответственный менеджер', key: 'manager_name' },
])

const search = ref('')
const partners = ref<any[]>([])

const page = ref(1)
const itemsPerPage = ref(50)
const totalItems = ref(0)
const loading = ref(false)

let searchTimer: number | undefined

const fetchPartners = async () => {
  loading.value = true
  try {
    const limit = itemsPerPage.value
    const offset = (page.value - 1) * limit

    const res = await restApi.get('/one_c/blogger/', {
      params: {
        limit,
        offset,
        search: search.value || null,
      },
    })

    partners.value = res.data?.items ?? []
    totalItems.value = res.data?.total ?? 0
  } finally {
    loading.value = false
  }
}

const onUpdateOptions = (options: any) => {
  if (typeof options?.page === 'number') page.value = options.page
  if (typeof options?.itemsPerPage === 'number') itemsPerPage.value = options.itemsPerPage
  fetchPartners()
}

const onSearchInput = () => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    page.value = 1
    fetchPartners()
  }, 400)
}

const onRowClick = (...args: { item: { [x: string]: any; id: string } }[]) => {
  store.role = 'blogManager'
  router.push({ path: `/dms/partnerManager/${args[1].item.id_}` })
}

onMounted(fetchPartners)
</script>

<style scoped lang="scss">
.partner {
  &-search {
    padding: 8px 8px;
    margin-bottom: 8px;
  }
}

:deep(.partners-table thead th) {
  background-color: #000 !important;
  color: #fff !important;
}

:deep(.partners-table thead th:hover) {
  color: #666666 !important;
}
</style>
