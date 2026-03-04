<template>
  <div class="pa-4">
    <!-- Header -->
    <div class="d-flex align-start mb-6">
      <v-btn class="mt-1" variant="text" icon="mdi-arrow-left" @click="goBack" />
      <div class="ml-2">
        <div class="text-h5 font-weight-medium">Редактировать блогера</div>
        <div class="text-body-2 text-medium-emphasis">
          Измените необходимые поля и сохраните профиль блогера
        </div>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <v-card class="mb-4" variant="outlined">
      <v-card-title class="text-subtitle-1">Основная информация</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-caption mb-1">Ник блогера *</div>
            <v-text-field
              v-model="form.nickname"
              placeholder="Введите ник блогера"
              variant="outlined"
              density="comfortable"
              hide-details
            />
            <div class="text-caption text-medium-emphasis mt-1">
              Общий ник, который может быть привязан к разным площадкам
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" md="4">
            <div class="text-caption mb-1">Фамилия *</div>
            <v-text-field
              v-model="form.surname"
              placeholder="Введите фамилию"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption mb-1">Имя *</div>
            <v-text-field
              v-model="form.name"
              placeholder="Введите имя"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption mb-1">Отчество</div>
            <v-text-field
              v-model="form.patronymic"
              placeholder="Введите отчество"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" variant="outlined">
      <v-card-title class="d-flex align-center justify-space-between text-subtitle-1">
        <span>Площадки</span>
        <v-btn color="black" variant="flat" prepend-icon="mdi-plus" @click="addPlace">
          Добавить площадку
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-for="(p, idx) in form.advertisement_places" :key="idx" class="mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2">Площадка {{ idx + 1 }}</div>
            <v-btn icon="mdi-delete-outline" variant="text" @click="removePlace(idx)" />
          </div>

          <v-row>
            <v-col cols="12" md="6">
              <div class="text-caption mb-1">Площадка</div>
              <v-select
                v-model="p.advertisement_place"
                :items="placeItems"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="comfortable"
                hide-details
                placeholder="Выберите площадку"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption mb-1">Ник на площадке</div>
              <v-text-field
                v-model="p.nickname"
                placeholder="@nickname или ссылка"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" variant="outlined">
      <v-card-title class="text-subtitle-1">Управление</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-caption mb-1">Ответственный менеджер *</div>

            <v-autocomplete
              v-model="form.responsible_manager"
              v-model:search="managerSearch"
              :items="managerItems"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="comfortable"
              hide-details
              placeholder="Начните вводить имя или фамилию"
              clearable
              :loading="loadingManagers"
              :no-data-text="managerNoDataText"
              :no-filter="true"
            />
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption mb-1">Контрагенты</div>

            <v-autocomplete
              v-model="form.counterparties"
              v-model:search="counterpartySearch"
              :items="counterpartyItems"
              item-title="label"
              item-value="value"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
              placeholder="Начните вводить название контрагента"
              clearable
              :loading="loadingCounterparties"
              :no-data-text="counterpartyNoDataText"
              :no-filter="true"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center justify-space-between text-subtitle-1">
        <span>Контакты для связи</span>
        <v-btn color="black" variant="flat" prepend-icon="mdi-plus" @click="addContact">
          Добавить контакт
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-for="(c, idx) in form.contacts" :key="idx" class="mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2">Контакт</div>
            <v-btn icon="mdi-delete-outline" variant="text" @click="removeContact(idx)" />
          </div>

          <v-row>
            <v-col cols="12" md="4">
              <div class="text-caption mb-1">Тип</div>
              <v-select
                v-model="c.type"
                :items="contactTypeItems"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="8">
              <div class="text-caption mb-1">Данные</div>
              <v-text-field
                v-model="c.value"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <div class="d-flex justify-end ga-3">
      <v-btn variant="outlined" @click="goBack">Отмена</v-btn>
      <v-btn
        color="black"
        variant="flat"
        prepend-icon="mdi-check"
        :loading="saving"
        :disabled="loading"
        @click="save"
      >
        Сохранить
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/plugins/router'
import { restApi } from '@/restApi/restMethods.vue'
import {
  CMS_ADVERTISEMENT_PLACES,
  CMS_ADVERTISEMENT_PLACE_LABELS,
  CMS_CONTACT_TYPES,
  CMS_CONTACT_TYPE_LABELS,
} from '@/modules/cms/constants'

definePage({
  meta: {
    title: 'Редактировать блогера',
    parentSection: 'CMS',
  },
})

type SelectItem = { value: any; label: string }

const route = useRoute()
const bloggerId = computed(() => String(route.params.id || ''))

const loading = ref(false)
const saving = ref(false)

const managerSearch = ref('')
const counterpartySearch = ref('')

const managerItems = ref<SelectItem[]>([])
const counterpartyItems = ref<SelectItem[]>([])

const selectedManagerCache = ref<Record<string, SelectItem>>({})
const selectedCounterpartyCache = ref<Record<string, SelectItem>>({})

const loadingManagers = ref(false)
const loadingCounterparties = ref(false)

const managerNoDataText = computed(() => {
  const q = managerSearch.value.trim()
  if (!q || q.length < 2) return 'Введите 2+ символа для поиска'
  return 'Ничего не найдено'
})

const counterpartyNoDataText = computed(() => {
  const q = counterpartySearch.value.trim()
  if (!q || q.length < 2) return 'Введите 2+ символа для поиска'
  return 'Ничего не найдено'
})

const form = reactive<any>({
  id: '',
  nickname: '',
  name: '',
  surname: '',
  patronymic: '',
  advertisement_places: [{ advertisement_place: '', nickname: '' }],
  responsible_manager: '',
  counterparties: [] as string[],
  contacts: [{ type: 'phone', value: '' }],
})

const placeItems = computed<SelectItem[]>(() =>
  CMS_ADVERTISEMENT_PLACES.map((p) => ({
    value: p,
    label: CMS_ADVERTISEMENT_PLACE_LABELS[p] || p,
  })),
)

const contactTypeItems = computed<SelectItem[]>(() =>
  CMS_CONTACT_TYPES.map((t) => ({
    value: t,
    label: CMS_CONTACT_TYPE_LABELS[t] || t,
  })),
)

function uniqBy<T>(arr: T[], keyFn: (v: T) => string) {
  const seen = new Set<string>()
  const out: T[] = []
  for (const v of arr) {
    const k = keyFn(v)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(v)
  }
  return out
}

function addPlace() {
  form.advertisement_places.push({ advertisement_place: '', nickname: '' })
}
function removePlace(i: number) {
  form.advertisement_places.splice(i, 1)
  if (form.advertisement_places.length === 0) addPlace()
}

function addContact() {
  form.contacts.push({ type: 'phone', value: '' })
}
function removeContact(i: number) {
  form.contacts.splice(i, 1)
  if (form.contacts.length === 0) addContact()
}

function goBack() {
  router.push(`/cms/bloggers/${bloggerId.value}`)
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

/** Нормализация площадок:
 * - DTO: { advertisement_place, nickname }
 * - legacy: { youtube: "@nick" } (объект с 1 ключом)
 */
function normalizeAdvertisementPlaces(input: any): Array<{ advertisement_place: string; nickname: string }> {
  const arr = Array.isArray(input) ? input : []
  const out: Array<{ advertisement_place: string; nickname: string }> = []

  for (const it of arr) {
    if (!it || typeof it !== 'object') continue

    if ('advertisement_place' in it && 'nickname' in it) {
      const ap = String((it as any).advertisement_place || '')
      const nn = String((it as any).nickname || '')
      if (ap && nn) out.push({ advertisement_place: ap, nickname: nn })
      continue
    }

    const entries = Object.entries(it)
    if (entries.length === 1) {
      const [k, v] = entries[0]
      if (typeof v === 'string' && k) out.push({ advertisement_place: String(k), nickname: v })
    }
  }

  return out
}

/** Нормализация контактов:
 * - DTO: { type, value }
 * - legacy: { phone: "+7..." } (объект с 1 ключом)
 */
function normalizeContacts(input: any): Array<{ type: string; value: string }> {
  const arr = Array.isArray(input) ? input : []
  const out: Array<{ type: string; value: string }> = []

  for (const it of arr) {
    if (!it || typeof it !== 'object') continue

    if ('type' in it && 'value' in it) {
      const t = String((it as any).type || '')
      const v = String((it as any).value || '')
      if (t && v) out.push({ type: t, value: v })
      continue
    }

    const entries = Object.entries(it)
    if (entries.length === 1) {
      const [k, v] = entries[0]
      if (typeof v === 'string' && k) out.push({ type: String(k), value: v })
    }
  }

  return out
}
async function loadBloggerCounterparties() {
  // /api/v1/marketing/cms_blogger/counterparties/?blogger_id=...
  const { data } = await restApi.get('/marketing/cms_blogger/counterparties/', {
    params: { blogger_id: bloggerId.value, limit: 100, offset: 0 },
  })

  const list = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : [])

  // id может называться id_ или id (страхуемся)
  const ids = list.map((c: any) => String(c?.id_ || c?.id)).filter(Boolean)
  form.counterparties = ids

  const items = list
    .map((c: any) => {
      const id = c?.id_ || c?.id
      if (!id) return null
      const label = c.fullname || c.name || String(id)
      return { value: String(id), label }
    })
    .filter(Boolean) as Array<{ value: string; label: string }>

  for (const it of items) selectedCounterpartyCache.value[String(it.value)] = it
  counterpartyItems.value = uniqBy(items, (x) => String(x.value))
}
async function loadBlogger() {
  loading.value = true
  try {
    const { data } = await restApi.get(`/marketing/cms_blogger/${bloggerId.value}`)

    form.id = data.id
    form.nickname = data.nickname ?? ''
    form.name = data.name ?? ''
    form.surname = data.surname ?? ''
    form.patronymic = data.patronymic ?? ''

    // ✅ площадки
    const ap = normalizeAdvertisementPlaces(data.advertisement_places)
    form.advertisement_places = ap.length ? ap : [{ advertisement_place: '', nickname: '' }]

    // ✅ контакты
    const cs = normalizeContacts(data.contacts)
    form.contacts = cs.length ? cs : [{ type: 'phone', value: '' }]

    // ✅ менеджер
    const rm = data.responsible_manager
    form.responsible_manager = rm?.id ?? ''
    if (rm?.id) {
      const it = {
        value: rm.id,
        label: rm.fullname || `${rm.surname ?? ''} ${rm.name ?? ''}`.trim() || rm.shortname || rm.id,
      }
      selectedManagerCache.value[String(it.value)] = it
      managerItems.value = [it]
    }

    // ✅ контрагенты (поддержка id_ и id)
    const cps = Array.isArray(data.counterparties) ? data.counterparties : []
    const ids = cps
      .map((c: any) => c?.id_ || c?.id)
      .filter(Boolean)
      .map(String)

    form.counterparties = ids

    const cpItems = cps
      .map((c: any) => {
        const id = c?.id_ || c?.id
        if (!id) return null
        const it = { value: String(id), label: c.fullname || c.name || String(id) }
        selectedCounterpartyCache.value[String(it.value)] = it
        return it
      })
      .filter(Boolean) as SelectItem[]

    counterpartyItems.value = uniqBy(cpItems, (x) => String(x.value))
  } finally {
    loading.value = false
  }
}

// --- managers search ---
const doSearchManagers = debounce(async (q: string) => {
  const query = q.trim()

  if (query.length < 2) {
    const selectedId = form.responsible_manager
    const selected =
      selectedId && selectedManagerCache.value[String(selectedId)]
        ? [selectedManagerCache.value[String(selectedId)]]
        : []
    managerItems.value = selected
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

    const selectedId = form.responsible_manager
    const selected =
      selectedId && selectedManagerCache.value[String(selectedId)]
        ? [selectedManagerCache.value[String(selectedId)]]
        : []

    managerItems.value = uniqBy([...selected, ...fetched], (x) => String(x.value))
  } finally {
    loadingManagers.value = false
  }
}, 300)

watch(managerSearch, (q) => doSearchManagers(q || ''))

// --- counterparties search ---
const doSearchCounterparties = debounce(async (q: string) => {
  const query = q.trim()

  if (query.length < 2) {
    const selectedIds: string[] = Array.isArray(form.counterparties) ? form.counterparties : []
    const selected = selectedIds
      .map((id) => selectedCounterpartyCache.value[String(id)])
      .filter(Boolean) as SelectItem[]
    counterpartyItems.value = selected
    return
  }

  loadingCounterparties.value = true
  try {
    const { data } = await restApi.get('/one_c/blogger/', {
      params: { search: query, limit: 50, offset: 0 },
    })
    const items = Array.isArray(data?.items) ? data.items : []

    const fetched: SelectItem[] = items.map((c: any) => {
      const label = c.fullname || c.name || c.id_
      return { value: c.id_, label }
    })

    for (const it of fetched) selectedCounterpartyCache.value[String(it.value)] = it

    const selectedIds: string[] = Array.isArray(form.counterparties) ? form.counterparties : []
    const selected = selectedIds
      .map((id) => selectedCounterpartyCache.value[String(id)])
      .filter(Boolean) as SelectItem[]

    counterpartyItems.value = uniqBy([...selected, ...fetched], (x) => String(x.value))
  } finally {
    loadingCounterparties.value = false
  }
}, 300)

watch(counterpartySearch, (q) => doSearchCounterparties(q || ''))

async function save() {
  saving.value = true
  try {
    const payload = {
      id: form.id,
      nickname: form.nickname || null,
      name: form.name || null,
      surname: form.surname || null,
      patronymic: form.patronymic || null,
      advertisement_places: form.advertisement_places
        .filter((p: any) => p.advertisement_place && p.nickname)
        .map((p: any) => ({
          advertisement_place: p.advertisement_place,
          nickname: p.nickname,
        })),
      responsible_manager: form.responsible_manager || null,
      contacts: form.contacts
        .filter((c: any) => c.type && c.value)
        .map((c: any) => ({ type: c.type, value: c.value })),
      counterparties: form.counterparties?.length ? form.counterparties : null,
    }

    await restApi.patch('/marketing/cms_blogger/', payload)
    router.push(`/cms/bloggers/${bloggerId.value}`)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadBlogger()
  await loadBloggerCounterparties()
})
</script>
