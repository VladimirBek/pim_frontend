<template>
  <div>
      <v-container fluid id="bloggers-data-module">
      <v-row>
        <v-col>

              <div class="mb-4">
                <h4 style="display: inline;">Блогеры</h4> |
                  <v-btn
                    @click="saveData"
                    variant="outlined"
                    color="success"
                  >Сохранить данные</v-btn>
                  |
                  <v-btn
                    @click="addNewRow"
                    color="primary"
                    class="my-2 mx-auto"
                  >Добавить строку</v-btn>

              </div>

              <div v-if="bloggersTables && bloggersHeadersTransformed && productsSKUS">

                <div fluid>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model.trim="search"
                    append-icon="mdi-magnify"
                    label="Поиск"
                    single-line
                    hide-details
                    class="mb-4"
                  ></v-text-field>


                  <div>
                    <v-tabs v-model="tab" color="deep-purple-accent-4" density="compact" class="product-tabs__container" selected-class="product-tabs__container--active">
                      <v-tab v-for="(table, index) in bloggersTables" :value="index">
                        {{ table?.name }}
                      </v-tab>
                    </v-tabs>

                    <v-data-table
                      :headers="bloggersHeadersTransformed"
                      :items="bloggersTransformed"
                      multi-sort
                      :search="search"
                      fixed-header
                      fixed-footer
                      :items-per-page="bloggersTransformed.length"
                      hide-default-footer
                      disable-pagination
                    >
                      <template
                        v-for="(header, headerIndex) in bloggersHeadersTransformed" v-slot:[`item.${header.key}`]="{item, headerIndex}"
                      >
                        <div
                          @click="getCurrentValue(item, header, headerIndex)"
                          style="min-height: 100%; height: 100%; max-height: 100%;"
                        >
                            {{ item.selectable[header.key] }} &nbsp;
                        </div>
                      </template>

                      <template #bottom></template>
                    </v-data-table>

                  </div>
                </div>
              </div>

        </v-col>
      </v-row>
      </v-container>
    <div>

      <v-dialog width="500" v-model="isConfirmModalOpen">
        <v-card>
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-card-text>

                  <v-spacer></v-spacer>
                    <v-alert
                      type="warning"
                      title="Внимание"
                      text="При закрытии все изменения ячейки удалятся!"
                    ></v-alert>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text="Остаться"
                      variant="elevated"
                      color="warning"
                      @click="isConfirmModalOpen = false"
                    ></v-btn>

                    <v-btn
                      text="Всё равно закрыть"
                      variant="elevated"
                      color="error"
                      @click="closeDialog"
                    ></v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-container>



        </v-card>
      </v-dialog>


      <v-dialog width="300" v-model="isModalOpen" @click:outside="closeDialog" persistent>

          <v-card title="Редактирование значения">
            <v-card-text>

              <div>
                <v-combobox
                  v-if="currentHeader.title.includes('Артикул 1С')"
                  v-model="currentItem.selectable[currentHeader.key]"
                  :items="productsSKUS"
                  class="h-auto"
                  variant="outlined"
                  :menu-props="{ height: 300 }"
                ></v-combobox>

                <v-textarea v-else-if="!currentHeader.formula"
                  v-model="currentItemEditable"
                  rows="1"
                  placeholder="Введите данные"
                ></v-textarea>

                <v-textarea v-else-if="currentItem.selectable[currentHeader?.formula?.first] && currentItem.selectable[currentHeader?.formula?.second]"
                  :value="computedTableCell(
                    Number(currentItem.selectable[currentHeader.formula.first]),
                    Number(currentItem.selectable[currentHeader.formula.second]),
                    currentHeader.formula.operator,
                    tableIndex,
                    currentHeader.key,
                    currentIndex
                  )"
                  disabled
                  rows="1"
                  style="color: black;"
                  placeholder="Введите данные"
                ></v-textarea>

                <v-textarea v-else-if="currentItem.selectable[currentHeader?.formula?.first] && typeof Number(currentHeader?.formula?.second) === 'number'"
                  :value="computedTableCell(
                    Number(currentItem.selectable[currentHeader.formula.first]),
                    Number(currentHeader?.formula?.second),
                    currentHeader.formula.operator,
                    tableIndex,
                    currentHeader.key,
                    currentIndex
                  )"
                  disabled
                  rows="1"
                  style="color: black;"
                  placeholder="Введите данные"
                ></v-textarea>

                <div v-else></div>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Закрыть"
                variant="elevated"
                color="error"
                @click="confirmLeave"
              ></v-btn>

              <v-btn
                text="Сохранить"
                variant="elevated"
                color="success"
                @click="saveData"
              ></v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snack"
        :timeout="3000"
        :color="snackColor"
      >
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            v-bind="attrs"
            text
            @click="snack = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
  </template>

  <script setup>
  import { restApi }  from '@/restApi/restMethods.vue'
  import { useRouter, useRoute }  from 'vue-router';

  const router = useRouter()
  const route  = useRoute()

  const snack = ref(false)
  const snackColor = ref('')
  const snackText = ref('')
  const pagination = ref({})
  const isModalOpen = ref(false)
  const isConfirmModalOpen = ref(false)

  const currentItem = ref(null)
  const currentHeader = ref(null)
  const currentIndex = ref(null)
  const currentItemEditable = ref(null)

  // definePage({
  //   meta: {
  //     title: 'Блогеры',
  //     icon: 'mdi-view-list',
  //     drawerIndex: 6,
  //     breadcrumb: 'disabled',
  //   },
  // })

  const tab = ref(0)
  const slotName = ref('name')
  const search = ref('')
  const bloggers = ref([])
  const bloggersTables = ref([])
  const bloggersHeaders = ref([])

  const productsSKUS = ref(['АНК2284', 'АНК2291', 'АНК2307'])
  const changedRowsIds = ref([])
  const timer = ref(null)
  const isTableVisible = ref(false)

  const bloggersTransformed = computed(() => {
    if (bloggers.value) {
      const new_bloggers = bloggers.value.slice().reverse();
      return new_bloggers
    } else {
      return []
    }
  })

  const bloggersHeadersTransformed = computed(() => {
    if (bloggersHeaders.value) {
      const new_bloggersHeaders = unique(bloggersHeaders.value.map(v => ({...v, width: '200px'})), ['key'])
      return new_bloggersHeaders
    } else {
      return []
    }
  })

  onMounted(async () => {
    await restApi.post('/influence/tables').then(res => {
      bloggersTables.value = res.data
    })
    await restApi.post('/influence/fields', { "tableId": 1 }).then(res => {
      bloggersHeaders.value = res.data
    })
    await restApi.post('/influence/values', { "tableId": 1 }).then(res => {
      bloggers.value = res.data
    })
    productsSKUS.value = ['АНК2284', 'АНК2291', 'АНК2307']
    try {
      await restApi.post('/products', {
        source: 'pim'
      }).then(res => {
        const products = res.data
        productsSKUS.value = products.map(i => i.sku)
      })
    } catch {
      productsSKUS.value = ['АНК2284', 'АНК2291', 'АНК2307']
    }
    isTableVisible.value = true
  })

  function computedTableCell(firstCell, secondCell, operator, tableIndex, headerKey, rowIndex) {
    let result = 0

    if (operator == '/') {
      if (secondCell == 0) {
        result = 0
      } else {
        result = firstCell / secondCell
      }
    } else if (operator == '*') {
      result = firstCell * secondCell
    } else if (operator == '+') {
      result = firstCell + secondCell
    } else if (operator == '-') {
      result = firstCell - secondCell
    }

    if (isNaN(result)) {
      result = "Неверные данные. Оба исходных значения должны быть числовыми"
    }

    bloggers.value[tableIndex][rowIndex][headerKey] = result
    return result
  }

  let setAll = (obj, val) => Object.keys(obj).forEach(k => obj[k] = val);
  let setNull = obj => setAll(obj, null);

  async function addNewRow() {
    const tableId = tab.value + 1
    const newValues = bloggersHeaders.value.map(i => i.key).reduce((acc,curr)=> (acc[curr]='',acc),{});

    const data = {
      tableId,
      rowId: null,
      values: newValues
    }

    await restApi.post('/influence/values', { "tableId": tableId }).then(res => {
      bloggers.value = res.data
    })
  }

  async function getOtherTable() {
    isTableVisible.value = false
    const newTab = tab.value + 1
    await restApi.post('/influence/fields', { "tableId": newTab }).then(res => {
      bloggersHeaders.value = res.data
    })
    await restApi.post('/influence/values', { "tableId": newTab }).then(res => {
      bloggers.value = res.data
    })
    isTableVisible.value = true
  }
  watch([tab], getOtherTable)

  async function saveData() {
      if (!currentHeader.value.title.startsWith("Артикул 1С")) {
        currentItem.value.selectable[currentHeader.value.key] = currentItemEditable.value
      }
      const tableId = tab.value + 1

      try {
          const data = {
            tableId,
            rowId: currentIndex.value,
            values: bloggersTransformed.value.find(i => i.rowId == currentIndex.value)
          }

        Notify.success(`Данные успешно сохранены`)
      } catch (error) {
        console.error(error)
        Notify.error('Возникла ошибка при сохранении данных')
      } finally {
        isModalOpen.value = false
      }
  }

  function addIndex(index) {
    currentIndex.value = index
  }

  function save () {
    snack.value = true
    snackColor.value = 'success'
    snackText.value = 'Data saved'
  }
  function cancel () {
    snack.value = true
    snackColor.value = 'error'
    snackText.value = 'Canceled'
  }
  function open () {
    snack.value = true
    snackColor.value = 'info'
    snackText.value = 'Dialog opened'
  }

  function getCurrentValue(item, header, headerIndex) {
    currentItem.value = item
    currentHeader.value = header
    currentIndex.value = parseInt(item.selectable['rowId'])
    currentItemEditable.value = currentItem.value.selectable[currentHeader.value.key]
    isModalOpen.value = true
  }

  function unique(arr, keyProps) {
   const kvArray = arr.map(entry => {
    const key = keyProps.map(k => entry[k]).join('|');
    return [key, entry];
   });
   const map = new Map(kvArray);
   return Array.from(map.values());
  }

  function confirmLeave() {
    if (currentItem.value.selectable[currentHeader.value.key] == currentItemEditable.value) {
      isModalOpen.value = false
    } else {
      isConfirmModalOpen.value = true
    }
  }

  function closeDialog() {
    isConfirmModalOpen.value = false
    isModalOpen.value = false
  }

  </script>

  <style lang="scss">

  #bloggers-data-module {
    .v-table > .v-table__wrapper > table > tbody > tr > td,
    .v-table > .v-table__wrapper > table > tbody > tr > th,
    .v-table > .v-table__wrapper > table > thead > tr > td,
    .v-table > .v-table__wrapper > table > thead > tr > th,
    .v-table > .v-table__wrapper > table > tfoot > tr > td,
    .v-table > .v-table__wrapper > table > tfoot > tr > th {
      transition: height cubic-bezier(0.4, 0, 0.2, 1);
    }

    .v-table > .v-table__wrapper > table > tbody > tr {
      height: 1px;

      td {
        text-align: center;
        vertical-align: top;
        word-wrap: break-word;
        width: 200px;
        max-width: 200px;
        height: inherit;

        div {
          height: 100%;
        }
      }
    }

    @-moz-document url-prefix() {
      .v-table > .v-table__wrapper > table > tbody > tr {
        height: 1px;

        td {
          text-align: center;
          vertical-align: top;
          height: 100%;
          word-wrap: break-word;
          width: 200px;
          max-width: 200px;
          max-height: 100%;

          div {
            height: 100%;
          }
        }
      }
    }

    .v-table__wrapper {
      max-height: 74vh;
      padding-bottom: 10px;
    }

    .v-data-table {
      ::-webkit-scrollbar {
        width: 5px;
        height: 15px;
        position: sticky;
        position: -webkit-sticky;
        bottom: 0;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        position: sticky;
        position: -webkit-sticky;
        bottom: 0;
      }
      ::-webkit-scrollbar-thumb {
        background: #3a3a3a;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        position: sticky;
        position: -webkit-sticky;
        bottom: 0;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #131313;
        position: sticky;
        position: -webkit-sticky;
        bottom: 0;
      }
    }

    #table .v-data-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: white;
    }

    #table .v-data-table__wrapper {
      margin-bottom: 60px;
    }

    .placeholder-text {
      color: #888;
      opacity: 0.5;
    }
  }

  </style>

