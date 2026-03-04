<template>
  <div class="pa-4">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn variant="text" icon="mdi-arrow-left" @click="router.push('/cms/bloggers')" />

        <div class="d-flex align-center ml-2">
          <div class="title-icon mr-3">
            <v-icon icon="mdi-account" size="18" />
          </div>

          <div class="text-h6 font-weight-medium">
            <span v-if="blogger">{{ blogger.nickname }} - {{ fullName }}</span>
            <span v-else>Блогер</span>
          </div>
        </div>
      </div>

      <v-btn
        v-if="blogger?.id"
        color="black"
        variant="flat"
        prepend-icon="mdi-pencil"
        @click="router.push(`/cms/bloggers/${blogger.id}/edit`)"
      >
        Редактировать
      </v-btn>
    </div>

    <v-container v-if="blogger" fluid class="pa-0">
      <!-- Publications -->
      <v-card class="mb-6" variant="outlined" rounded="lg">
        <v-card-title class="d-flex align-center ga-3">
          <div class="section-icon">
            <v-icon icon="mdi-file-document-outline" size="18" />
          </div>
          <div>
            <div class="text-subtitle-1 font-weight-medium">Публикации блогера</div>
            <div class="text-caption text-medium-emphasis">
              Управление публикациями и рекламными кампаниями
            </div>
          </div>
        </v-card-title>

        <v-card-text>
          <!-- Filters line (макет) -->
          <div class="d-flex flex-wrap align-center ga-3 mb-4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-filter-variant" size="18" class="mr-2" />
              <span class="text-body-2">Фильтры:</span>
            </div>

            <v-select
              v-model="pubFilters.advertisement_place"
              :items="advertisementPlaceOptions"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              placeholder="Площадка"
              style="width: 160px"
            />

            <v-select
              v-model="pubFilters.status"
              :items="publicationStatusOptions"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              placeholder="Статус"
              style="width: 160px"
            />

            <v-text-field
              v-model="pubFilters.minSum"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="Мин. сумма"
              type="number"
              style="width: 140px"
            />

            <v-text-field
              v-model="pubFilters.maxSum"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="Макс. сумма"
              type="number"
              style="width: 140px"
            />

            <v-btn variant="text" density="comfortable" class="text-none" @click="resetPubFilters">
              × Сбросить
            </v-btn>
          </div>

          <!-- Table -->
          <v-data-table
            :headers="publicationHeaders"
            :items="filteredPublications"
            :loading="loadingPublications"
            class="elevation-0 publications-table"
            density="comfortable"
            item-key="id"
            hide-default-footer
          >
            <template #item.advertisement_place="{ item }">
              <div class="d-flex align-center ga-2">
                <v-icon :icon="placeIcon(item.advertisement_place)" size="18" />
                <span>{{ placeLabel(item.advertisement_place) }}</span>
              </div>
            </template>

            <template #item.product="{ item }">
              {{ item.product?.product_name ?? '-' }}
            </template>

            <template #item.transitions="{ item }">
              {{ item.transitions ?? '-' }}
            </template>

            <template #item.date_plan="{ item }">
              {{ formatDate(item.date_plan) }}
            </template>

            <template #item.date_fact="{ item }">
              {{ formatDate(item.date_fact) }}
            </template>

            <template #item.roas_fact="{ item }">
              {{ item.roas_fact ?? '-' }}
            </template>

            <template #item.price_nds="{ item }">
              <span class="font-weight-medium">{{ formatMoney(item.price_nds) }}</span>
            </template>
          </v-data-table>

          <!-- Bottom bar (макет) -->
          <div class="d-flex align-center justify-space-between mt-3">
            <div class="text-body-2 text-medium-emphasis">
              Всего записей: <b class="text-body-2">{{ filteredPublications.length }}</b>
              из <b class="text-body-2">{{ publicationsTotal }}</b>
            </div>

            <div class="d-flex align-center ga-3">
              <div class="text-body-2 text-medium-emphasis">Записей на странице:</div>

              <v-select
                v-model="pubPagination.limit"
                :items="[10, 15, 25, 50]"
                density="compact"
                variant="outlined"
                hide-details
                style="width: 90px"
              />

              <v-btn
                variant="outlined"
                density="comfortable"
                :disabled="pubPage <= 1"
                @click="setPubPage(pubPage - 1)"
              >
                Предыдущая
              </v-btn>

              <v-pagination
                v-model="pubPage"
                :length="pubPageCount"
                density="comfortable"
                rounded="lg"
              />

              <v-btn
                variant="outlined"
                density="comfortable"
                :disabled="pubPage >= pubPageCount"
                @click="setPubPage(pubPage + 1)"
              >
                Следующая
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Comments -->
      <v-card class="mb-6" variant="outlined" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <div class="section-icon">
              <v-icon icon="mdi-comment-text-outline" size="18" />
            </div>
            <div class="text-subtitle-1 font-weight-medium">Комментарии</div>
          </div>

          <v-btn prepend-icon="mdi-plus" color="black" variant="flat" @click="openAddComment = true">
            Добавить комментарий
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-progress-linear v-if="loadingComments" indeterminate />

          <div v-else class="d-flex flex-column ga-3">
            <v-alert
              v-if="comments.length === 0"
              type="info"
              variant="tonal"
              text="Комментариев пока нет"
            />

            <div v-for="c in comments" :key="c.id" class="comment-row">
              <div class="d-flex align-center justify-space-between">
                <div class="font-weight-medium">
                  {{ c.author?.fullname || c.author?.shortname || authorFallback(c.author) || '—' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDateTime(c.created_at) }}
                </div>
              </div>
              <div class="mt-2">
                {{ c.text }}
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Bottom cards row (макет) -->
      <v-row dense>
        <v-col cols="12" md="4">
          <v-card variant="outlined" rounded="lg">
            <v-card-title class="d-flex align-center ga-3">
              <div class="section-icon">
                <v-icon icon="mdi-bullhorn-outline" size="18" />
              </div>
              <div class="text-subtitle-1 font-weight-medium">Рекламные площадки</div>
            </v-card-title>
            <v-card-text>
              <div v-if="advertisementPlacesUi.length === 0" class="text-medium-emphasis">—</div>
              <div v-else class="d-flex flex-column ga-2">
                <div v-for="p in advertisementPlacesUi" :key="p.key" class="d-flex align-center">
                  <v-icon :icon="placeIcon(p.place)" size="18" class="mr-2" />
                  <div class="text-body-2">{{ p.nickname }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card variant="outlined" rounded="lg">
            <v-card-title class="d-flex align-center ga-3">
              <div class="section-icon">
                <v-icon icon="mdi-account-tie-outline" size="18" />
              </div>
              <div class="text-subtitle-1 font-weight-medium">Менеджер и контрагенты</div>
            </v-card-title>
            <v-card-text>
              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Ответственный менеджер:</div>
                <div class="font-weight-medium">
                  {{ blogger.responsible_manager?.fullname || blogger.responsible_manager?.shortname || authorFallback(blogger.responsible_manager) || '—' }}
                </div>
              </div>

              <div>
                <div class="text-caption text-medium-emphasis">Контрагенты:</div>
                <div v-if="!blogger.counterparties || blogger.counterparties.length === 0">—</div>

                <div v-else class="d-flex flex-column ga-2">
                  <div
                    v-for="cp in blogger.counterparties"
                    :key="counterpartyKey(cp)"
                    class="d-flex align-center justify-space-between"
                  >
                    <div class="font-weight-medium">
                      {{ typeof cp === 'string' ? cp : (cp.fullname || cp.name || counterpartyId(cp) || '—') }}
                    </div>

                    <!-- КЛИКАБЕЛЬНАЯ ССЫЛКА -->
                    <a
                      v-if="counterpartyId(cp)"
                      class="cp-link"
                      :href="`/dms/partnerDoc/${counterpartyId(cp)}`"
                      title="Открыть контрагента"
                      @click.stop
                    >
                      <v-icon icon="mdi-open-in-new" size="16" />
                    </a>

                    <span v-else class="cp-link cp-link--disabled" title="Нет id контрагента">
                      <v-icon icon="mdi-open-in-new" size="16" />
                    </span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card variant="outlined" rounded="lg">
            <v-card-title class="d-flex align-center ga-3">
              <div class="section-icon">
                <v-icon icon="mdi-card-account-mail-outline" size="18" />
              </div>
              <div class="text-subtitle-1 font-weight-medium">Контактная информация</div>
            </v-card-title>
            <v-card-text>
              <div v-if="contactLines.length === 0" class="text-medium-emphasis">—</div>
              <div v-else class="d-flex flex-column ga-3">
                <div v-for="c in contactLines" :key="c.key" class="d-flex align-start">
                  <v-icon :icon="c.icon" size="18" class="mr-2 mt-1" />
                  <div>
                    <div class="text-caption text-medium-emphasis">{{ c.label }}</div>
                    <div class="font-weight-medium">{{ c.value }}</div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-skeleton-loader v-else type="article, article" />

    <!-- Add comment dialog -->
    <v-dialog v-model="openAddComment" max-width="640">
      <v-card rounded="lg">
        <v-card-title class="text-h6">Новый комментарий</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="newCommentText"
            label="Текст"
            auto-grow
            rows="3"
            counter
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="openAddComment = false">Отмена</v-btn>
          <v-btn
            color="black"
            variant="flat"
            :disabled="!newCommentText.trim()"
            :loading="savingComment"
            @click="submitComment"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import router from '@/plugins/router'
import { restApi } from '@/restApi/restMethods.vue'
import {
  CMS_ADVERTISEMENT_PLACES,
  CMS_ADVERTISEMENT_PLACE_LABELS,
  CMS_PUBLICATION_STATUSES,
} from '@/modules/cms/constants'

definePage({
  meta: {
    title: 'Блогер',
    parentSection: 'CMS',
  },
})

const route = useRoute()
const blogger = ref<any | null>(null)

// Publications
const publications = ref<any[]>([])
const publicationsTotal = ref<number>(0)
const loadingPublications = ref(false)
const pubPagination = reactive({
  limit: 15,
  offset: 0,
})

const pubFilters = reactive({
  advertisement_place: null as string | null,
  status: null as string | null,
  minSum: '' as string | number,
  maxSum: '' as string | number,
})

// Comments
const comments = ref<any[]>([])
const loadingComments = ref(false)
const openAddComment = ref(false)
const newCommentText = ref('')
const savingComment = ref(false)

const fullName = computed(() => {
  if (!blogger.value) return ''
  return [blogger.value.surname, blogger.value.name, blogger.value.patronymic].filter(Boolean).join(' ')
})

const advertisementPlaceOptions = computed(() =>
  CMS_ADVERTISEMENT_PLACES.map((p) => ({ title: placeLabel(p), value: p })),
)

const publicationStatusOptions = computed(() =>
  CMS_PUBLICATION_STATUSES.map((s) => ({ title: s, value: s })),
)

// Table headers строго под макет (+ ROAS факт)
const publicationHeaders = [
  { title: 'Площадка', key: 'advertisement_place', sortable: true },
  { title: 'Продукт', key: 'product', sortable: false },
  { title: 'Переходы', key: 'transitions', sortable: true },
  { title: 'Дата план', key: 'date_plan', sortable: true },
  { title: 'Дата факт', key: 'date_fact', sortable: true },
  { title: 'ROAS факт', key: 'roas_fact', sortable: true },
  { title: 'Стоимость с НДС', key: 'price_nds', sortable: true },
]

// Pagination for publications (считает по publicationsTotal если есть)
const pubPage = computed({
  get: () => Math.floor(pubPagination.offset / pubPagination.limit) + 1,
  set: (v: number) => setPubPage(v),
})

const pubPageCount = computed(() => {
  const total = publicationsTotal.value || publications.value.length
  return Math.max(1, Math.ceil(total / pubPagination.limit))
})

function setPubPage(p: number) {
  const safe = Math.min(Math.max(1, p), pubPageCount.value)
  pubPagination.offset = (safe - 1) * pubPagination.limit
  void loadPublications()
}

const filteredPublications = computed(() => {
  const min = pubFilters.minSum === '' ? null : Number(pubFilters.minSum)
  const max = pubFilters.maxSum === '' ? null : Number(pubFilters.maxSum)

  return publications.value.filter((p) => {
    const price = typeof p.price_nds === 'number' ? p.price_nds : null
    if (min !== null && price !== null && price < min) return false
    if (max !== null && price !== null && price > max) return false
    return true
  })
})

/**
 * Поддержка двух форматов:
 * 1) DTO: [{advertisement_place, nickname}, ...]
 * 2) старый: [{ instagram: "@x" }, { youtube: "@y" }]
 */
const advertisementPlacesUi = computed(() => {
  const arr = Array.isArray(blogger.value?.advertisement_places) ? blogger.value.advertisement_places : []
  const rows: Array<{ key: string; place: string; nickname: string }> = []

  for (const entry of arr) {
    if (!entry) continue

    // DTO format
    if (typeof entry === 'object' && 'advertisement_place' in entry && 'nickname' in entry) {
      const place = String((entry as any).advertisement_place || '')
      const nickname = String((entry as any).nickname || '')
      if (place && nickname) rows.push({ key: `${place}:${nickname}`, place, nickname })
      continue
    }

    // old mapping format
    if (typeof entry === 'object') {
      for (const [place, nickname] of Object.entries(entry)) {
        if (!nickname) continue
        rows.push({ key: `${place}:${nickname}`, place: String(place), nickname: String(nickname) })
      }
    }
  }
  return rows
})

/**
 * Поддержка двух форматов контактов:
 * 1) DTO: [{type, value}]
 * 2) старый: [{ phone: "+7..." }, { email: "..." }]
 */
const contactLines = computed(() => {
  const arr = Array.isArray(blogger.value?.contacts) ? blogger.value.contacts : []
  const rows: Array<{ key: string; label: string; value: string; icon: string }> = []

  const iconByKey: Record<string, string> = {
    email: 'mdi-email-outline',
    phone: 'mdi-phone-outline',
    telegram: 'mdi-telegram',
    vk: 'mdi-vk',
    max: 'mdi-message-outline',
    tiktok: 'mdi-music-note',
    youtube: 'mdi-youtube',
  }

  for (const entry of arr) {
    if (!entry) continue

    // DTO
    if (typeof entry === 'object' && 'type' in entry && 'value' in entry) {
      const k = String((entry as any).type || '')
      const v = String((entry as any).value || '')
      if (!k || !v) continue
      rows.push({
        key: `${k}:${v}`,
        label: k,
        value: v,
        icon: iconByKey[k] ?? 'mdi-account-box-outline',
      })
      continue
    }

    // old mapping
    if (typeof entry === 'object') {
      for (const [k, v] of Object.entries(entry)) {
        if (!v) continue
        rows.push({
          key: `${k}:${v}`,
          label: String(k),
          value: String(v),
          icon: iconByKey[String(k)] ?? 'mdi-account-box-outline',
        })
      }
    }
  }

  return rows
})

function counterpartyId(cp: any): string | null {
  if (!cp) return null
  if (typeof cp === 'string') return cp
  const id =
    cp.id_ ??
    cp.id ??
    cp.counterparty_id ??
    cp.partner_id ??
    cp.guid ??
    cp.uuid
  return id ? String(id) : null
}

function counterpartyKey(cp: any): string {
  return counterpartyId(cp) || (typeof cp === 'string' ? cp : JSON.stringify(cp))
}

function placeLabel(place: string) {
  return CMS_ADVERTISEMENT_PLACE_LABELS[place] ?? place
}

function placeIcon(place: string) {
  const p = String(place || '').toLowerCase()
  if (p.includes('youtube')) return 'mdi-youtube'
  if (p.includes('telegram')) return 'mdi-telegram'
  if (p.includes('vk')) return 'mdi-vk'
  if (p.includes('tiktok')) return 'mdi-music-note'
  if (p.includes('instagram')) return 'mdi-instagram'
  return 'mdi-bullhorn-outline'
}

function authorFallback(author: any | null | undefined) {
  if (!author) return ''
  const name = [author.surname, author.name].filter(Boolean).join(' ')
  return name || ''
}

function formatMoney(value: any) {
  if (value === null || value === undefined || value === '') return '-'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return `${n.toLocaleString('ru-RU')} ₽`
}

function formatDate(value: any) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('ru-RU')
}

function formatDateTime(value: any) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })
}

function resetPubFilters() {
  pubFilters.advertisement_place = null
  pubFilters.status = null
  pubFilters.minSum = ''
  pubFilters.maxSum = ''
  pubPagination.offset = 0
  void loadPublications()
}

async function loadBlogger() {
  const id = route.params.id as string
  const { data } = await restApi.get(`/marketing/cms_blogger/${id}`)
  blogger.value = data
}

async function loadPublications() {
  if (!blogger.value?.id) return
  loadingPublications.value = true
  try {
    const params: Record<string, any> = {
      limit: pubPagination.limit,
      offset: pubPagination.offset,
      blogger_id: blogger.value.id,
    }
    if (pubFilters.advertisement_place) params.advertisement_place = pubFilters.advertisement_place
    if (pubFilters.status) params.status = pubFilters.status

    const res = await restApi.get('/marketing/cms_publication/', { params })
    const data = (res as any).data

    // поддержка форматов: массив или {items,total}
    if (Array.isArray(data)) {
      publications.value = data
      publicationsTotal.value = data.length
    } else {
      publications.value = Array.isArray(data?.items) ? data.items : []
      publicationsTotal.value = typeof data?.total === 'number' ? data.total : publications.value.length
    }

    const hdrTotal = (res as any)?.headers?.['x-total-count']
    if (hdrTotal != null && !Number.isNaN(Number(hdrTotal))) {
      publicationsTotal.value = Number(hdrTotal)
    }
  } finally {
    loadingPublications.value = false
  }
}

async function loadComments() {
  if (!blogger.value?.id) return
  loadingComments.value = true
  try {
    const { data } = await restApi.get('/marketing/cms_blogger/get_comments/', {
      params: {
        limit: 50,
        offset: 0,
        cms_blogger_id: blogger.value.id,
      },
    })
    comments.value = Array.isArray(data) ? data : []
  } finally {
    loadingComments.value = false
  }
}

async function submitComment() {
  if (!blogger.value?.id) return
  savingComment.value = true
  try {
    await restApi.post('/marketing/cms_blogger/add_comment/', {
      cms_blogger_id: blogger.value.id,
      text: newCommentText.value.trim(),
    })
    newCommentText.value = ''
    openAddComment.value = false
    await loadComments()
  } finally {
    savingComment.value = false
  }
}

onMounted(async () => {
  await loadBlogger()
  await Promise.all([loadPublications(), loadComments()])
})
</script>

<style scoped>
.title-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #111;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.section-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #111;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.publications-table :deep(thead th) {
  font-weight: 600;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.comment-row {
  border-left: 4px solid #cbd5e1;
  padding-left: 14px;
}

/* Делает иконку 100% кликабельной */
.cp-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  text-decoration: none;

  cursor: pointer;

  /* ключевое */
  pointer-events: auto !important;
  position: relative;
  z-index: 9999;
}

.cp-link:hover {
  background: rgba(0, 0, 0, 0.06);
}

.cp-link--disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
