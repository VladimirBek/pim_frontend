<template>
  <div class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="text-h5 font-weight-medium">Список блогеров</div>

      <v-btn color="black" variant="flat" prepend-icon="mdi-plus" @click="goCreate">
        Добавить блогера
      </v-btn>
    </div>

    <!-- Filters (как в макете) -->
    <div class="d-flex align-center flex-wrap ga-3 mb-4">
      <div class="d-flex align-center mr-1">
        <v-icon class="mr-2" icon="mdi-filter-variant" />
        <span class="text-body-2">Фильтры:</span>
      </div>

      <v-text-field
        v-model="filters.nickname"
        density="compact"
        variant="outlined"
        placeholder="Никнейм"
        hide-details
        style="width: 220px"
      />

      <v-select
        v-model="filters.status"
        density="compact"
        variant="outlined"
        :items="statusItems"
        item-title="label"
        item-value="value"
        hide-details
        style="width: 180px"
      />

      <v-select
        v-model="filters.place"
        density="compact"
        variant="outlined"
        :items="placeItems"
        item-title="label"
        item-value="value"
        hide-details
        style="width: 180px"
      />

      <!-- Менеджер: серверный autocomplete, но визуально как селект "Все менеджеры" -->
      <v-autocomplete
        v-model="filters.managerId"
        v-model:search="managerSearch"
        density="compact"
        variant="outlined"
        :items="managerItems"
        item-title="label"
        item-value="value"
        hide-details
        style="width: 220px"
        placeholder="Все менеджеры"
        clearable
        :loading="loadingManagers"
        :no-data-text="managerNoDataText"
        :no-filter="true"
      />

      <v-btn
        variant="text"
        color="grey-darken-2"
        prepend-icon="mdi-close"
        @click="resetFilters"
      >
        Сбросить фильтры
      </v-btn>
    </div>

    <!-- Table (только нужные колонки) -->
    <v-card variant="outlined" class="pa-0">
      <v-table class="bloggers-table" density="comfortable">
        <thead>
          <tr>
            <th>Никнейм</th>
            <th>Площадки</th>
            <th>Стоимость последней публикации</th>
            <th>Статус</th>
            <th>Менеджер</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="b in bloggers"
            :key="b.id"
            class="row-click"
            @click="goDetail(b.id)"
          >
            <td>{{ b.nickname }}</td>

            <td>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="(p, idx) in normalizePlaces(b.advertisement_places)"
                  :key="idx"
                  size="small"
                  color="black"
                  variant="flat"
                  class="text-white"
                >
                  {{ placeLabel(p.advertisement_place || p) }}
                </v-chip>
              </div>
            </td>

            <td class="font-weight-medium">
              {{ formatPrice(b.last_publication?.price_fact) }}
            </td>

            <td>
              <v-chip size="small" color="blue-lighten-4" class="text-blue-darken-3" variant="flat">
                {{ b.status }}
              </v-chip>
            </td>

            <td>{{ b.responsible_manager?.fullname || '-' }}</td>
          </tr>

          <tr v-if="!loading && bloggers.length === 0">
            <td colspan="5" class="text-center text-medium-emphasis py-6">
              Ничего не найдено
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Footer pagination (как в макете) -->
    <div class="d-flex align-center justify-space-between mt-4">
      <div class="text-body-2">
        Всего записей:
        <b>{{ bloggers.length }}</b>
        <span v-if="total != null"> из <b>{{ total }}</b></span>
      </div>

      <div class="d-flex align-center ga-3">
        <div class="text-body-2">Показывать по:</div>

        <v-select
          v-model="pagination.limit"
          density="compact"
          variant="outlined"
          :items="[10, 15, 25, 50]"
          hide-details
          style="width: 90px"
        />

        <v-btn
          variant="outlined"
          density="comfortable"
          :disabled="page <= 1"
          @click="prevPage"
        >
          Предыдущая
        </v-btn>

        <div class="d-flex align-center ga-2">
          <v-btn
            v-for="p in pagesToShow"
            :key="p"
            :variant="p === page ? 'flat' : 'outlined'"
            :color="p === page ? 'black' : undefined"
            density="comfortable"
            style="min-width: 36px; padding: 0 10px;"
            @click="setPage(p)"
          >
            {{ p }}
          </v-btn>

          <span v-if="pageCount > maxPagesButtons" class="px-1">…</span>

          <v-btn
            v-if="pageCount > maxPagesButtons"
            :variant="page === pageCount ? 'flat' : 'outlined'"
            :color="page === pageCount ? 'black' : undefined"
            density="comfortable"
            style="min-width: 36px; padding: 0 10px;"
            @click="setPage(pageCount)"
          >
            {{ pageCount }}
          </v-btn>
        </div>

        <v-btn
          variant="outlined"
          density="comfortable"
          :disabled="page >= pageCount"
          @click="nextPage"
        >
          Следующая
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/plugins/router'
import { restApi } from '@/restApi/restMethods.vue'
import { CMS_ADVERTISEMENT_PLACES, CMS_ADVERTISEMENT_PLACE_LABELS, CMS_BLOGGER_STATUSES } from '@/modules/cms/constants'

definePage({
  meta: {
    title: 'Блогеры',
    parentSection: 'CMS',
  },
})

type SelectItem = { value: string; label: string }

const loading = ref(false)
const bloggers = ref<any[]>([])
const total = ref<number | null>(null)

const filters = reactive({
  nickname: '',
  status: '' as string | '',
  place: '' as string | '',
  managerId: '' as string | '',
})

const pagination = reactive({
  limit: 10,
  offset: 0,
})

const page = computed(() => Math.floor(pagination.offset / pagination.limit) + 1)

const pageCount = computed(() => {
  // Если бэк отдаёт total (в body или заголовке) — считаем страницы
  if (total.value == null) return 1
  return Math.max(1, Math.ceil(total.value / pagination.limit))
})

const maxPagesButtons = 5
const pagesToShow = computed(() => {
  const pc = pageCount.value
  const p = page.value
  const n = Math.min(maxPagesButtons, pc)
  // показываем 1..n (как на макете, плюс последняя через "…")
  if (pc <= n) return Array.from({ length: pc }, (_, i) => i + 1)
  return Array.from({ length: n }, (_, i) => i + 1).map((x) => x) // 1..5
})

const statusItems = computed(() => [
  { label: 'Все статусы', value: '' },
  ...CMS_BLOGGER_STATUSES.map((s) => ({ label: s, value: s })),
])

const placeItems = computed(() => [
  { label: 'Все площадки', value: '' },
  ...CMS_ADVERTISEMENT_PLACES.map((p) => ({ label: placeLabel(p), value: p })),
])

function placeLabel(v: string) {
  return CMS_ADVERTISEMENT_PLACE_LABELS[v] || v
}

function normalizePlaces(val: any) {
  return Array.isArray(val) ? val : []
}

function formatPrice(v: any) {
  if (v == null || v === '') return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return String(v)
  return `${n.toLocaleString('ru-RU')} ₽`
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

async function reload() {
  loading.value = true
  try {
    const params: any = {
      limit: pagination.limit,
      offset: pagination.offset,
    }
    if (filters.nickname) params.nickname = filters.nickname
    if (filters.status) params.status = filters.status
    if (filters.place) params.advertisement_place = filters.place
    if (filters.managerId) params.manager_id = filters.managerId

    const res = await restApi.get('/marketing/cms_blogger/', { params })

    // поддержка форматов ответа:
    // 1) массив
    // 2) { items: [...], total: number }
    const data = (res as any).data
    if (Array.isArray(data)) {
      bloggers.value = data
      // total неизвестен
      total.value = null
    } else {
      bloggers.value = Array.isArray(data?.items) ? data.items : []
      total.value = typeof data?.total === 'number' ? data.total : null
    }

    // если total пришёл заголовком — тоже поддержим
    const hdrTotal = (res as any)?.headers?.['x-total-count']
    if (total.value == null && hdrTotal != null && !Number.isNaN(Number(hdrTotal))) {
      total.value = Number(hdrTotal)
    }
  } finally {
    loading.value = false
  }
}

/* --- серверный автокомплит менеджеров --- */
const managerSearch = ref('')
const loadingManagers = ref(false)
const managerOptions = ref<SelectItem[]>([])
const selectedManagerCache = ref<Record<string, SelectItem>>({})

const managerNoDataText = computed(() => {
  const q = managerSearch.value.trim()
  if (!q || q.length < 2) return 'Введите 2+ символа для поиска'
  return 'Ничего не найдено'
})

const managerItems = computed(() => managerOptions.value)

const doSearchManagers = debounce(async (q: string) => {
  const query = q.trim()

  if (query.length < 2) {
    const selectedId = filters.managerId
    const selected =
      selectedId && selectedManagerCache.value[String(selectedId)]
        ? [selectedManagerCache.value[String(selectedId)]]
        : []
    managerOptions.value = selected
    return
  }

  loadingManagers.value = true
  try {
    const { data } = await restApi.get('/marketing/cms_blogger/profiles/', {
      params: { search: query },
    })

    const list = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
    const fetched: SelectItem[] = list.map((m: any) => {
      const label =
        m.fullname ||
        `${m.surname ?? ''} ${m.name ?? ''}`.trim() ||
        m.shortname ||
        m.id
      return { value: m.id, label }
    })

    for (const it of fetched) selectedManagerCache.value[String(it.value)] = it

    const selectedId = filters.managerId
    const selected =
      selectedId && selectedManagerCache.value[String(selectedId)]
        ? [selectedManagerCache.value[String(selectedId)]]
        : []

    const merged = [...selected, ...fetched]
    const seen = new Set<string>()
    managerOptions.value = merged.filter((x) => {
      const k = String(x.value)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  } finally {
    loadingManagers.value = false
  }
}, 300)

watch(managerSearch, (q) => doSearchManagers(q || ''))

/* --- серверные фильтры: при изменении -> reload --- */
const scheduleReload = debounce(() => {
  pagination.offset = 0
  reload()
}, 300)

watch(
  () => [filters.nickname, filters.status, filters.place, filters.managerId],
  () => scheduleReload(),
)

watch(
  () => pagination.limit,
  () => {
    pagination.offset = 0
    reload()
  },
)

function resetFilters() {
  filters.nickname = ''
  filters.status = ''
  filters.place = ''
  filters.managerId = ''
  managerSearch.value = ''
  pagination.offset = 0
  reload()
}

function setPage(p: number) {
  pagination.offset = (p - 1) * pagination.limit
  reload()
}
function prevPage() {
  if (page.value <= 1) return
  setPage(page.value - 1)
}
function nextPage() {
  if (page.value >= pageCount.value) return
  setPage(page.value + 1)
}

function goCreate() {
  router.push('/cms/bloggers/new')
}
function goDetail(id: string) {
  router.push(`/cms/bloggers/${id}`)
}

onMounted(() => reload())
</script>

<style scoped>
.bloggers-table thead th {
  font-weight: 600;
  background: #fff;
}

.row-click {
  cursor: pointer;
}
.row-click:hover td {
  background: rgba(0, 0, 0, 0.03);
}
</style>
