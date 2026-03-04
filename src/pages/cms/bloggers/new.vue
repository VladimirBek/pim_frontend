<template>
  <div class="pa-4">
    <!-- Header -->
    <div class="d-flex align-start mb-6">
      <v-btn class="mt-1" variant="text" icon="mdi-arrow-left" @click="goBack" />
      <div class="ml-2">
        <div class="text-h5 font-weight-medium">Новый блогер</div>
        <div class="text-body-2 text-medium-emphasis">
          Заполните все необходимые поля для создания профиля блогера
        </div>
      </div>
    </div>

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
        <v-btn
          color="black"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="addPlace"
        >
          Добавить площадку
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div
          v-for="(p, idx) in form.advertisement_places"
          :key="idx"
          class="mb-4"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2">Площадка {{ idx + 1 }}</div>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              @click="removePlace(idx)"
            />
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
        <v-btn
          color="black"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="addContact"
        >
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
        @click="save"
      >
        Создать блогера
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
    title: 'Новый блогер',
    parentSection: 'CMS',
  },
})

type SelectItem = { value: any; label: string }

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
  if (!q) return 'Введите 2+ символа для поиска'
  if (q.length < 2) return 'Введите 2+ символа для поиска'
  return 'Ничего не найдено'
})

const counterpartyNoDataText = computed(() => {
  const q = counterpartySearch.value.trim()
  if (!q) return 'Введите 2+ символа для поиска'
  if (q.length < 2) return 'Введите 2+ символа для поиска'
  return 'Ничего не найдено'
})

const form = reactive<any>({
  nickname: '',
  name: '',
  surname: '',
  patronymic: '',
  advertisement_places: [{ advertisement_place: '', nickname: '' }],
  responsible_manager: '',
  counterparties: [] as string[],

  // по требованию: одна строка по умолчанию
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
  router.push('/cms/bloggers')
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

// --- Remote search: managers ---
const doSearchManagers = debounce(async (q: string) => {
  const query = q.trim()
  if (query.length < 2) {
    // сохраняем выбранный элемент, чтобы не показывать uuid
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

    // поддерживаем оба формата: [] или {items: []}
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

watch(managerSearch, (q) => {
  doSearchManagers(q || '')
})

// --- Remote search: counterparties ---
const doSearchCounterparties = debounce(async (q: string) => {
  const query = q.trim()
  if (query.length < 2) {
    // оставляем выбранные чипы человекочитаемыми
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

watch(counterpartySearch, (q) => {
  doSearchCounterparties(q || '')
})

async function save() {
  saving.value = true
  try {
    const payload = {
      nickname: form.nickname,
      name: form.name,
      surname: form.surname,
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
    await restApi.post('/marketing/cms_blogger/', payload)
    router.push('/cms/bloggers')
  } finally {
    saving.value = false
  }
}
</script>
