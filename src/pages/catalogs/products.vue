<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="products-header">
          <h4 class="products-header__title">Список товаров</h4>
          <div class="products-header__actions">
            <v-text-field
              v-model.trim="search"
              append-inner-icon="mdi-magnify"
              label="Поиск"
              single-line
              hide-details
              density="compact"
              variant="outlined"
              class="products-header__search"
            ></v-text-field>
            <v-btn class="products-button__primary--filter" @click="isDialogShown = !isDialogShown" >
              <v-icon class="products-button__icon" color="#FFFFFF" :icon="isFiltred ? 'mdi-filter' : 'mdi-filter-outline'"></v-icon>
              <p class="products-header__link">Фильтр</p>
            </v-btn>
            <router-link class="products-header__link" :to="'/catalogs/product/new'">
              <v-btn class="products-button__primary">
                <v-icon class="products-button__icon" color="#FFFFFF" icon="custom:plus"></v-icon>
                <p class="products-header__link">Добавить товар</p>
              </v-btn>
            </router-link>
          </div>
        </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="productsTransformed"
            :search="search"
            @click:row="onRowClick"
          >
          </v-data-table>
        </v-card>
        <v-dialog
          v-model="isDialogShown"
          width="960">
          <v-card 
          title="Добавить фильтр"
          class="filter-container">
          <div class="filter-container__attribute">
            <h3>Брэнд</h3>
            <div class="filter-container__list">
              <div v-for="brand in brands" :key="brand.brandId" class="filter-container__item">
                <v-checkbox :label="brand.name" density="compact" @update:model-value="setFilter($event, brand.name, 'brand')"></v-checkbox>
              </div>
            </div>
            </div>
            <div class="filter-container__attribute">
              <h3>Юнит</h3>
              <div class="filter-container__list">
                <div v-for="unit in units" :key="unit.unitId" class="filter-container__item">
                  <v-checkbox :label="unit.name" density="compact" @update:model-value="setFilter($event, unit.name, 'unit')"></v-checkbox>
                </div>
              </div>
            </div>
            <div class="filter-container__actions">
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="clearFilter()"
              >
                Отменить
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="isDialogShown = !isDialogShown"
              >
                Применить
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import type { Router } from 'vue-router';
import { restApi } from '@/restApi/restMethods.vue';
import { useRouter } from 'vue-router';

const router: Router = useRouter()

definePage({
  meta: {
    title: 'Список товаров',
    icon: 'mdi-view-list',
    drawerIndex: 0,
  },
})

const search = ref('');
const products = ref([]);
const isFiltred = ref(false);
const filteredProducts = ref([]);
const filter = ref({
  unit: [],
  brand: [],
  productLine: [],
  status: [],
});
const brands = ref([]);
const units = ref([]);
const isDialogShown = ref(false);

const headers = ref([
  { title: 'SKU', key: 'sku' },
  { title: 'НАЗВАНИЕ', key: 'name' },
  { title: 'ЮНИТ', key: 'unit' },
  { title: 'БРЕНД', key: 'brand' },
  { title: 'ЛИНЕЙКА', key: 'line' },
  { title: 'СТАТУС', key: 'status' },
])

const productsTransformed = computed(() => {
  const tableData = isFiltred.value ? filteredProducts.value : products.value ;
  if (tableData) {
    return tableData.map((product) => {
      return {
        sku: product.sku ?? '',
        name: product.name || '',
        unit: product.unitName,
        brand: product.brandName,
        line: product.productLineName,
        status: product.status || 'Черновик',
        id: product.productId
      }
    });
  } else {
    return []
  }
})

const setFilter = (event, filter, attribute) => {
  if (event) {
    let findedProducts = []
    if (attribute === 'brand') {
      findedProducts = products.value.filter(el => filter === el.brandName)
      filteredProducts.value = filteredProducts.value.concat(findedProducts)
    } else if (attribute === 'unit') {
      findedProducts = products.value.filter(el => filter === el.unitName)
      filteredProducts.value = filteredProducts.value.concat(findedProducts)
    }
    isFiltred.value = true
  } else {
    if (attribute === 'brand') {
      filteredProducts.value = filteredProducts.value.filter(el => filter !== el.brandName)
    } else if (attribute === 'unit') {
      filteredProducts.value = filteredProducts.value.filter(el => filter !== el.unitName)
    } 
    isFiltred.value = false
  }
}

const clearFilter = () => {
  isFiltred.value = false;
  isDialogShown.value = !isDialogShown.value
}

const onRowClick = (...args) => {
    router.push({ path: `/catalogs/product/${args[1].item.id}` })
}

onMounted(async () => {
  await restApi.post('/products', {
    source: 'pim'
  }).then(res => {
    products.value = res.data
  });
  await restApi.post('/units').then(res => {
    units.value = res.data;
  });
  await restApi.post('/brands').then(res => {
    brands.value = res.data;
  });
});


</script>

<style scoped lang="scss">
.filter {
  &-container {
    font-size: 14px;
    &__attribute {
      padding: 12px 24px;
    }
    &__list {
      display: flex;
      column-gap: 12px;
      flex-wrap: wrap;
    }
    &__item {
      max-width: 180px;
      width: 100%;
    }
    &__actions {
      padding: 8px;
      display: flex;
      justify-content: end;
    }
  }
}
.products{
  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &__title {
      font-size: 32px;
      width: 100%;
      max-width: 300px;
    }
    &__actions {
      display: flex;
      align-items: center;
      width: 100%;
    }
    &__link {
      color: #fff;
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;
    }
    &__search {
      margin-right: 20px;
    }
  }
  &-button{
    &__primary {
    background-color: #F98100;
    &--filter {
      background-color: #F98100;
      margin-right: 8px;
    }
    }
    &__icon {
      max-width: 24px;
      max-height: 24px;
      width: 100%;
      height: 100%;
    }
  }
}  
</style>