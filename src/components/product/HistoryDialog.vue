<template>
    <v-dialog
      v-model="props.isHistoryShown"
      width="1360"
      @update:model-value="$emit('closeDialog')"
    >
      <v-form
      v-if="pagination && historyPage"
      class="dialog-container">
        <v-card
          title="История изменений"
        >
          <v-card-text>
            <v-data-table
                v-if="history"
                :headers="tableHeaders"
                :items="history"
                :search="search"
                density="compact"
                :hide-default-footer="true"
                :items-per-page="pagination.perPage"
                :loading="!historyPage?.history || !(historyPage?.history?.length > 0)"
                loading-text="Данные ещё не загружены"
            >
              <template v-slot:item.date="{ item }" >
                {{ toReadableDate(item.date) }}
              </template>

              <template v-slot:item.oldValue="{ item }" >
                <div v-if="Array.isArray(item.oldValue)">
                  {{ item.oldValue.toString() }}
                </div>
                <div v-else>
                  {{ item.oldValue }}
                </div>
              </template>

              <template v-slot:item.newValue="{ item }" >
                <div v-if="Array.isArray(item.newValue)">
                  {{ item.newValue.toString() }}
                </div>
                <div v-else>
                  {{ item.newValue }}
                </div>
              </template>

              <template #bottom></template>
            </v-data-table>
              <v-row>
                <v-col cols="7">
                  Показать по: <v-btn v-for="i in [10,20,30,50,100]" variant="text" size="small" @click="perPage = i"><span :style="perPage == i && 'color: blue'">{{ i }}</span></v-btn>
                  | {{ pagination.pageCount }} стр.
                </v-col>
                <v-col cols="5" class="text-right">
                  <v-btn
                    v-for="i in pagesArray"
                    :key="i.id"
                    class="mx-2"
                    fab
                    dark
                    small
                    :color="i == page ? 'primary' : 'white'"
                    :disabled="page == i"
                    size="small"
                    @click="page = i">
                    <div v-if="page == i">
                      {{ i }}
                    </div>
                    <v-icon v-else-if="i == 1">
                      mdi-arrow-collapse-left
                    </v-icon>
                    <v-icon v-else-if="i == page - 1">
                      mdi-less-than
                    </v-icon>
                    <v-icon v-else-if="i == page + 1">
                      mdi-greater-than
                    </v-icon>
                    <v-icon v-else>
                      mdi-arrow-collapse-right
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
          </v-card-text>

          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="$emit('closeDialog')"
              >
                Закрыть
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
</template>

<script setup lang="ts">

import { restApi } from '@/restApi/restMethods.vue';
import { useProductStore } from '@/stores/product';
import { useUserStore } from '@/stores/user';

const productStore = useProductStore();
const userStore = useUserStore();


const tableHeaders = ref([
  { title: 'Дата', key: 'date', width: '15%' },
  { title: 'Автор', key: 'userName', sortable: false, width: '10%' },
  { title: 'Что изменено', key: 'attributeName', sortable: false, width: '15%' },
  { title: 'Старое значение', key: 'oldValue', sortable: false, width: '30%' },
  { title: 'Новое значение', key: 'newValue', sortable: false, width: '30%' },
])

const search = ref('')
const historyPage = ref(null)
const pagination = ref(null)
const perPage = ref(20)
const page = ref(1)
const isLoaded = ref(false)
const reloadRefs = ref(true)
const emits = defineEmits(["closeDialog"]);
const props = defineProps({
  isHistoryShown: {
    type: Boolean,
    required: true,
    default: () => false
  },
  source: {
    type: String,
    required: true,
    default: () => ""
  },
  productId: {
    type: String,
    required: true,
    default: () => ""
  }
})

onMounted(async () => {
  getHistoryData(page.value, perPage.value)
  isLoaded.value = true
})

const history = computed(() => {
  if (historyPage.value) {
    historyPage.value.history.map((el) => {
      el.userName = userStore.users.find((user) => el.userId.toUpperCase() === user.userId.toUpperCase())?.username
      if (props.source === 'pim') {
        el.attributeName = productStore.pimAttributes.find((attr) => el.attributeId === attr.attributeId)?.name
      } else if (props.source === 'ozon') {
        el.attributeName = productStore.ozonAttributes.find((attr) => el.attributeId === attr.attributeId)?.name
      } else {
        el.attributeName = productStore.wbAttributes.find((attr) => el.attributeId === attr.attributeId)?.name
      }
    })
    return historyPage.value.history
  }
  return null;
})
const pagesArray = computed(() => {
  const pagesButtons = []
  if (page.value > 2) {
    pagesButtons.push(1)
  }
  if (page.value > 1) {
    pagesButtons.push(page.value-1)
  }
  pagesButtons.push(page.value)
  if (page.value<pagination.value.pageCount) {
    pagesButtons.push(page.value+1)
  }
  if (page.value+1<pagination.value.pageCount) {
    pagesButtons.push(page.value+2)
  }
  return pagesButtons
})

function toReadableDate(oldDate) {
  const jsdate = new Date(oldDate)
  const day = jsdate.getUTCDate()
  const month = jsdate.getUTCMonth() + 1
  const year = jsdate.getUTCFullYear()
  const hour = jsdate.getHours()
  const minutes = jsdate.getMinutes()
  const lessThan10 = x => x < 10 ? '0' : ''

  return `${day}.${lessThan10(month)}${month}.${year} в ${lessThan10(hour)}${hour}:${lessThan10(minutes)}${minutes}`
}

watch([page, perPage], async (newValue, oldValue) => {
  if (reloadRefs.value) {
    getHistoryData(page.value, perPage.value)
  }
})

async function getHistoryData(pageNew = pagination.page || 1, perPageNew = pagination.perPage) {
  const historyData = {
    "source": props.source === 'wb' ? 'wildberries' : props.source,
    "productId": props.productId,
    "page": pageNew,
    "perPage": perPageNew
  }

  try {
    let response = await restApi.post('/attributes/history', historyData)
    historyPage.value = response.data
    if (historyPage.value.history.length === 0 && pageNew !== 1) {
      reloadRefs.value = false
      historyData.page = 1
      response = await restApi.post('/attributes/history', historyData)
      historyPage.value = response.data
      pagination.value = response.data.pagination
      page.value = response.data.pagination.page
      perPage.value = response.data.pagination.perPage
      reloadRefs.value = true
    }
    try {
      pagination.value = response.data.pagination
    } catch (error) {
      console.error(error);
    }      
  } catch (error) {}
}

</script>

<style scoped>
.dialog-container{
overflow: scroll;
}

</style>