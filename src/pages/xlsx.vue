<template>

    <v-container class="text-center">
      <input type="file" ref="file" @change="onChange"/>

      <a 
        class="me-2"
        download
        href="/api/v2/file/template_pim.xlsx">
        <v-btn
          color="warning"
          download
        >Скачать файл шаблона</v-btn>
      </a>

      <v-btn
        color="success"
        @click="$refs.file.click()"
      >Загрузить номенклатуры</v-btn>
    </v-container>

    <v-container fluid>
      <v-row>
        <v-col>

          <v-card v-if="items && items.length > 0">
            <v-data-table
              :headers="headers"
              :items="items"
              multi-sort
              :items-per-page="items.length"
            >
              <template v-slot:item.set="{ item }" >
                {{ item.set ? 'да' : 'нет' }}
              </template>
            </v-data-table>

            <div class="text-center">
              <v-btn
              color="primary"
              class="my-2 mx-auto"
              @click="sendData"
              >Отправить данные</v-btn>
            </div>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import * as XLSX from "xlsx"
  import { restApi }  from '@/restApi/restMethods.vue'
  
  // definePage({
  //   meta: {
  //     title: 'Массовая загрузка',
  //     icon: 'mdi-view-list',
  //     drawerIndex: 10,
  //     breadcrumb: 'disabled',
  //   },
  // })

  const file = ref(null)
  const file_data = ref([])
  const brands = ref([])
  const productLines = ref([])
  const productsSKUS = ref([])

  onMounted(async () => {
    await restApi.post('/brands').then(res => brands.value = res.data)

    for (let i = 0; i < brands.value.length; i++) {
      await restApi.post('/productLines', { brandId: brands.value[i]?.brandId }).then(res => {
          productLines.value.push(res.data);
      });
    }

    await restApi.post('/products', {
      source: 'pim'
    }).then(res => {
      const products = res.data
      productsSKUS.value = products.map(i => i.sku)
    })
  })
  

    const headers = [
        { title: 'Название', key: 'name' },
        { title: 'Бренд', key: 'brand' },
        { title: 'Линейка', key: 'productLine' },
        { title: 'Юнит', key: 'unit' },
        { title: 'Комплект', key: 'set' },
        { title: 'Статус', key: 'status' },
        { title: 'Артикул', key: 'SKU' },
    ]

    const items = computed(() => {
            const array = []
            for (let i = 1; i < file_data.value.length; i++) {
                array.push({
                    name: file_data.value[i][0] ? `${file_data.value[i][0]}` : '',
                    brand: file_data.value[i][1] ? `${file_data.value[i][1]}` : '',
                    productLine: file_data.value[i][2] ? `${file_data.value[i][2]}` : null,
                    unit: file_data.value[i][3] ? file_data.value[i][3] : '',
                    set: (file_data.value[i][4] && (typeof file_data.value[i][4] === "string" || file_data.value[i][4] instanceof String) &&
                    (file_data.value[i][4]?.toUpperCase() === "ДА" || 
                    file_data.value[i][4]?.toUpperCase() === "КОМПЛЕКТ" ||
                    file_data.value[i][4]?.toUpperCase() === "TRUE" ||
                    file_data.value[i][4]?.toUpperCase() === "ИСТИНА")) ||
                    file_data.value[i][4] === true,
                    status: statusValue(file_data.value[i][5]),
                    SKU: file_data.value[i][6] ?? null,
                })
            }
            const arrayFiltered = array.filter(i => i.name || i.brand || i.productLine || i.unit || i.set)
            for (let i = 0; i < arrayFiltered.length; i++) {
              if (!arrayFiltered[i].name) { Notify.error(`Ошибка! Не заполнено название товара на строке ${i+1}`); return [] }

              if (arrayFiltered[i].status && arrayFiltered[i].status.toUpperCase().trim() !== "ЧЕРНОВИК" && arrayFiltered[i].status.toUpperCase().trim() !== "В РАБОТЕ") {
                { Notify.error(`Ошибка! Неверное значение статуса "${arrayFiltered[i].status}" находится строке ${i+1}`); return [] }
              }

              if (!arrayFiltered[i].unit) { Notify.error(`Ошибка! Не заполнено название юнита на строке ${i+1}`); return [] }
              if (arrayFiltered[i].unit !== 1 && arrayFiltered[i].unit !== 2) { Notify.error(`Ошибка! Неверное значение юнита "${arrayFiltered[i].unit}" находится строке ${i+1}`); return [] }
              
              if (!arrayFiltered[i].brand) { Notify.error(`Ошибка! Не заполнено название бренда на строке ${i+1}`); return [] }

              if (!brands.value.map(brand => brand?.name?.toUpperCase().trim()).includes(arrayFiltered[i].brand.toUpperCase().trim()))  { Notify.error(`Ошибка! Данный бренд "${arrayFiltered[i].brand}" не найден в списке брендов PIM ${arrayFiltered[i]?.brand} на строке ${i+1}`); return [] }

              if (arrayFiltered[i].productLine) {
                const currentBrandId = brands.value.find(j => j.name.toUpperCase().trim() == arrayFiltered[i].brand.toUpperCase().trim()).brandId
                const productLinesOfCurrentBrand = productLines.value.flat().filter(pl => pl.brandId == currentBrandId).map(j => j.name.toUpperCase().trim())
                
                if (!productLinesOfCurrentBrand.includes(arrayFiltered[i]?.productLine?.toUpperCase().trim())) { Notify.error(`Ошибка! Данная линейка не найдена в списке продуктовых линеек бренда ${arrayFiltered[i]?.productLine} в PIM - ${arrayFiltered[i]?.brand} на строке ${i+1}`); return []}
              }
            }
            return arrayFiltered
    })

  const onChange = (event) => {
      file.value = event.target.files ? event.target.files[0] : null;
      const reader = new FileReader();
      reader.readAsBinaryString(file.value);
      if (file.value) {
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          file_data.value = XLSX.utils.sheet_to_json(ws, { header: 1 });
          file.value.value = null;
        }
        Notify.success(`Данные файла успешно загружены`);
      }
  }

  function statusValue(value) {
    if (value) {
      if (value?.toUpperCase() === "ЧЕРНОВИК") {
        return "Черновик"
      } else if (value?.toUpperCase() === "В РАБОТЕ") {
        return "В работе"
      } else {
        return value
      }
    } else {
      return null
    }
  }

  async function sendData() {
    try {
      await restApi.post('/nomenclatures', items.value).then(res => {})
      Notify.success(`Данные файла успешно сохранены на сервер`);
    } catch (error) {
      Notify.error(`Не удалось сохранить данные файла на сервер`);
    }
  }
  
  </script>

<style lang="scss" scoped>
input[type='file'] {
  display: none;
}
</style>