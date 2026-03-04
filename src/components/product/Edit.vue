<template>
  <v-snackbar 
  v-model="snackbarShown"
  location="top"
  :timeout="1000">
  {{ snackbarText }}
  </v-snackbar>
  <v-container v-if="!isLoaded" class="product-preloader">
    <v-progress-circular indeterminate :size="70"></v-progress-circular>
  </v-container>
  <v-container v-else fluid>
    <div class="product-header__container">
      <h2> {{ shownHeader }} </h2>
      <div class="product-header__list">
        <span
          v-if="props.isEdit"
          class="product-info__text"> SKU : {{ store.pim.sku }} </span>
        <div class="product-header__list">
            <div v-for="status in store.statusList" :key="status.attributeId" class="status-list">
                <div class="product-header__status"
                    :class="status === store.activeStatus ? 'status-active' : ''">
                    {{ status }}
                    <div 
                    v-if="status === 'Маркетплейс' && (store.activeStatus === 'Маркетплейс' || store.activeStatus === 'Продажи')"
                    class="product-header__substatus" :style="`color: ${subStatus.color}`">
                        <v-icon 
                        icon="custom:dot" 
                        :color="subStatus.color"
                        class="status-icon__dot"></v-icon>
                        {{ subStatus.name }}
                    </div>
                </div>
                <v-icon v-if="status === store.activeStatus && store.activeStatus !== 'Продажи'"
                    icon="custom:arrow" class="status-icon">
                </v-icon>
            </div>
        </div>
        <v-btn 
          v-if="props.isEdit && store.activeStatus !== 'Продажи'" class="status-button"
            @click="changeStatus()">
            <v-icon icon="custom:check"></v-icon> Сменить статус
        </v-btn>
      </div>
    </div>
    <v-row>
      <v-col>
        <v-card>
          <v-container class="product-tabs pb-0">
            <v-tabs v-model="tab" color="deep-purple-accent-4" density="compact" class="product-tabs__container" selected-class="product-tabs__container--active">
              <v-tab v-if="sources.length === 0 || sources.includes('pim')" :value="'pim'" hide-slider class="product-tabs__item">
                Общие параметры
              </v-tab>  
              <v-tab v-if="props.isEdit && (sources.length === 0 || sources.includes('ozon'))" :value="'ozon'" hide-slider class="product-tabs__item">
                Ozon
                <v-icon v-if="isIconShown" icon="custom:dot" :color="ozonStatusColor" class="product-tabs__icon"></v-icon>
              </v-tab>
              <v-tab v-if="props.isEdit && (sources.length === 0 || sources.includes('wildberries'))" :value="'wb'" hide-slider class="product-tabs__item">
                Wildberries
                <v-icon v-if="isIconShown" icon="custom:dot" :color="wbStatusColor" class="product-tabs__icon"></v-icon>
              </v-tab>
            </v-tabs>
            <div v-if="isHistory" class="product-info__text">
              Изменено: {{ toReadableDate(store.pimHistory.history[0].date) }} {{ userName ? userName : '' }}
            </div>
          </v-container>
          <v-window v-model="tab" :loading="true">
            <v-window-item value="pim">
              <v-container fluid>
              <div class="header-primary">
                <div class="header-primary__name">
                  <h3 class="header-title">Название товара</h3>
                  <v-text-field 
                      v-model="productName" 
                      placeholder="Укажите название товара" 
                      density="compact"
                      class="product-header__input" 
                      variant="outlined">
                  </v-text-field>
                </div>
                <div class="header-primary__name">
                  <h3 class="header-title">
                  Короткое название
                  </h3>
                  <v-text-field 
                  v-model="shortName" 
                  placeholder="Укажите название товара" 
                  density="compact"
                  class="product-header__input" 
                  variant="outlined">
                  </v-text-field>
                </div>
                  <div>
                      <h3 class="header-title">
                          Юнит
                      </h3>
                      <v-select 
                          v-model="unit" 
                          placeholder="Выбрать" 
                          variant="outlined" 
                          :items="store.unitsList" 
                          density="compact"
                          disabled>
                      </v-select>
                  </div>
                  <div>
                      <h3 class="header-title">Бренд</h3>
                      <v-select 
                          v-model="brand" 
                          placeholder="Выберите бренд" 
                          :items="store.brandsList" 
                          item-title="name"
                          variant="outlined"
                          density="compact"></v-select>
                  </div>
                  <div v-if="store.productLines.length > 0">
                      <h3 class="header-title">Продуктовая линейка</h3>
                      <v-select 
                          v-model="productLine" 
                          placeholder="Выберите линейку" 
                          :items="store.productLinesList"
                          item-title="name" 
                          item-value="name" 
                          variant="outlined"  
                          hide-details
                          density="compact"></v-select>
                  </div>
              </div>
                <Pim :is-edit="$props.isEdit"/>
                <UnionDialog
                  v-if="isUnionShown"
                  :is-dialog-shown="isUnionShown"
                  :source="tab"
                  @close-dialog="isUnionShown = false"
                />
              </v-container>
            </v-window-item>
            <v-window-item value="ozon">
              <v-container fluid>
                  <Ozon :is-edit="$props.isEdit"/>
              </v-container>
            </v-window-item>
            <v-window-item value="wb">
              <v-container fluid>
                  <Wb :is-edit="$props.isEdit"/>
                  </v-container>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
          <!-- <v-card 
            v-if="isHistory"
            class="mt-0 mb-5">
            <v-card-title>
              <h3>История изменений</h3>
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <p>Изменено {{ toReadableDate(store.pimHistory.history[0].date) }}</p>
                <p>{{ userName }}</p>
              </div>
              <v-btn
                class="product-info__union" 
                color="primary" 
                @click="isHistoryShown = true">
                Вся история изменений
              </v-btn>
            </v-card-text>
          </v-card> -->
      </v-row>

    </v-container>
                <div class="product-actions__container">
                  <div  v-if="!props.isEdit" class="product-actions__buttons">
                    <v-btn class="me-2 product-actions__button" :to="'/product/products'">
                      Отменить
                    </v-btn>
                    <v-btn class="product-actions__button" color="primary" :disabled="isAlreadySaved" @click="saveProduct()">
                      Сохранить
                    </v-btn>
                  </div>
                </div>
    <v-container>
      <v-card 
        v-if="tab !== 'pim' || (tab === 'pim' && store.pim.isKit)"
        class="product-unions__container">
        <v-card-title>
        <div class="product-unions__header">
          <h3>{{ unionHeader }}</h3>
        </div>
        </v-card-title>
        <v-card-text
          v-if="isUnionTableShown"
          class="product-unions__table">
          <v-data-table
            :headers="unionHeaders"
            :items="unionProducts"
            density="compact"
            items-per-page="5"
          >
          </v-data-table>
        </v-card-text>
        <v-card-text v-else>
          <p class="product-unions__content">Товары отсутствуют</p>
          <v-btn class="product-info__union" color="primary" @click="isUnionShown = true">
            {{ tab === 'pim' ? 'Добавить' : 'Объединить' }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
    <HistoryDialog
      v-if="isHistoryShown && props.isEdit"
      :product-id = "productId"
      :source = "tab"
      :is-history-shown="isHistoryShown"
      @close-dialog="isHistoryShown = false"
      @close-on-back="isHistoryShown = false"
      @close-on-content-click="isHistoryShown = false"
    ></HistoryDialog>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import HistoryDialog from './HistoryDialog.vue';
import UnionDialog from './UnionDialog.vue';
import Pim from './Pim.vue';
import Ozon from './Ozon.vue';
import Wb from './Wb.vue';

const route = useRoute();
const store = useProductStore();
const userStore = useUserStore();

const sources = ref([]);
const tab = ref('pim');
const isUnionShown = ref(false);
const isHistoryShown = ref(false);
const isLoaded = ref(false);
const productId = ref(null);
const snackbarShown = ref(false);
const snackbarText = ref('Для сохранения необходимо заполнить поля Название, Бренд')
const id = ref(null)
const isAlreadySaved = ref(false)
const unionHeaders = ref([
  { title: 'SKU', key: 'sku' },
  { title: 'НАЗВАНИЕ', key: 'name' },
]);

const emit = defineEmits(['toggle-is-edit'])
const props = defineProps({
    isEdit: {
      type: Boolean,
      required: true,
      default: () => false,
    }
});

const shownHeader = computed(() => props.isEdit ? 'Редактирование товара' : 'Создание товара');


const productName = computed({
    get() {
        const id = store.pimAttributes.find((el) => el.alias === 'name')?.attributeId;
        const attribute = store.pim.attributes?.find(el => el.attributeId === id);
        return attribute ? attribute.value : '';
    },
    set(value) {
        const attributeId = store?.pimAttributes?.find((el) => el?.alias === 'name')?.attributeId;
        const attribute = store.pim.attributes?.find((el) => el.attributeId === attributeId);
        if (attribute) {
            attribute.value = value;
        } else {
            store.pim.attributes.push({ attributeId, value });
        }
    }
});

const shortName = computed({
    get() {
        const id = store.pimAttributes.find((el) => el.alias === 'shortName')?.attributeId;
        const attribute = store.pim.attributes?.find(el => el.attributeId === id);
        return attribute ? attribute.value : '';
    },
    set(value) {
        const attributeId = store.pimAttributes.find((el) => el.alias === 'shortName').attributeId;
        const attribute = store.pim.attributes?.find((el) => el.attributeId === attributeId);
        if (attribute) {
            attribute.value = value;
        } else {
            store.pim.attributes.push({ attributeId, value });
        }
    }
});


const unit = computed({
    get() {
        const unit = store.units.find(el => el.unitId === store.pim.unitId);
        return unit ? unit.name : null;
    },
    set(value) {
        store.pim.unitId = store.units.find(el => el.name === value).unitId;
    }
});

const brand = computed({
    get() {
        const brand = store.brands.find(el => el.brandId === store.pim.brandId);
        return brand ? brand.name : null;
    },
    set(value) {
        store.pim.brandId = store.brands.find(el => el.name === value).brandId;
        store.getProductLines(store.pim.brandId);
    }
});

const productLine = computed({
    get() {
        const productLine = store.productLines.find(el => el.productLineId === store.pim.productLineId);
        return productLine ? productLine.name : null;
    },
    set(value) {
        store.pim.productLineId = store.productLines.find(el => el.name === value).productLineId;
    }
});

const subStatus = computed(() => {
    const ozonValue = store.pim.ozonStatus;
    const wbValue = store.pim.wbStatus;
    const params = {
        name: '',
        color: ''
    }
    if (ozonValue === 3 || wbValue === 3) {
        params.name = 'Ошибка',
        params.color = '#F00'
    }
    else if (ozonValue === 1 || wbValue === 1) {
        params.name = 'Отправлен',
        params.color = '#76808A'
    } else if (ozonValue === 2 || wbValue === 2) {
        params.name = 'Успешно',
        params.color = '#21C16B'
    } else {
        params.name = 'Отправлен',
        params.color = '#76808A'
    }
    return params;
});

const unionProducts = computed(() => {
  let products = [];
  let productIds = [];
  if (tab.value === 'pim') {
    productIds = store.pim.union
    products = store.pimProducts
  } else if (tab.value === 'ozon') {
    productIds = store.ozon.union
    products = store.ozonProducts
  } else {
    productIds = store.wildberries.union
    products = store.wbProducts
  }
  return products.filter(el => productIds.includes(el.productId))
});

const isIconShown = computed(() => {
  return store.activeStatus === 'Маркетплейс' || store.activeStatus === 'Продажи'
});

const isUnionTableShown = computed(() => {
  if (tab.value === 'pim') {
    return store.pim.union.length > 0
  } else if (tab.value === 'ozon') {
    return store.ozon.union.length > 0
  } else {
    return store.wildberries.union.length > 0
  }
});

const ozonStatusColor = computed(() => {
  const value = store.pim.ozonStatus
  if (value === 1) {
    return '#76808A'
  } else {
    return value === 2 ? '#21C16B' : '#F00'
  }
});

const wbStatusColor = computed(() => {
  const value = store.pim.wbStatus
  if (value === 1) {
    return '#76808A'
  } else {
    return value === 2 ? '#21C16B' : '#F00'
  }
});

const unionHeader = computed(() => {
  return tab.value === 'pim' ? 'Товары в комплекте' : `Объединённые товары ${tab.value}` 
})

const isHistory = computed(() => {
  if (tab.value === 'pim' && store.pimHistory.history) {
    return store.pimHistory.history.length > 0 && props.isEdit
  } else if (tab.value === 'ozon' && store.ozonHistory.history) {
    return store.ozonHistory.history.length > 0 && props.isEdit
  } else if (store.wbHistory.history){
    return store.wbHistory.history.length > 0 && props.isEdit
  } return null
})

const userName = computed(() => {
  if (tab.value === 'pim' && isHistory) {
    return userStore.users.find(el => el.userId === store.pimHistory?.history[0]?.userId)?.username
  } else if (tab.value === 'ozon' && store.ozonHistory?.history && store.ozonHistory?.history.length > 0) {
    return userStore.users.find(el => el.userId === store.ozonHistory?.history[0]?.userId)?.username
  } else if (store.wbHistory?.history && store.wbHistory?.history.length > 0) {
    return userStore.users.find(el => el.userId.toUpperCase() === store.wbHistory?.history[0]?.userId)?.username
  }
})

function toReadableDate(oldDate) {
  const date = new Date(oldDate)
  const day = date.getUTCDate()
  const month = date.getUTCMonth() + 1
  const year = date.getUTCFullYear()
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const lessThan10 = x => x < 10 ? '0' : ''

  return `${day}.${lessThan10(month)}${month}.${year} в ${lessThan10(hour)}${hour}:${lessThan10(minutes)}${minutes}`
};

const saveProduct = async () => {
  if (store.isHeaderValid && (store.activeStatus === 'Черновик' || store.activeStatus === 'В работе')) {
    if (!props.isEdit) {
      isAlreadySaved.value = true
      const result = await store.saveProduct(id.value, 'pim');
      id.value = result.data.productId
      emit("toggle-is-edit", true)
      const skuAttributeId = store.pimAttributes.find((el) => el.alias === 'vendorCode')?.attributeId;
      store.pim.attributes.push({
        attributeId: skuAttributeId,
        value: result.data.vendorCode,
      });
      store.pim.sku = result.data.vendorCode
      store.pim.productId = result.data.productId
      productId.value = result.data.productId
      window.history.pushState('page', 'Title', `/catalogs/product/${result.data.productId}`);
      snackbarText.value = 'Товар успешно создан';
    }
  }
  snackbarShown.value = true;
};

onMounted(async () => {
  store.$reset();
  store.getAttributes('pim', null);
  store.getParams(props.isEdit);
  sources.value = JSON.parse(localStorage.getItem('sources'));
  const isPim = sources.value.length === 0 || sources.value.includes('pim');
  const isOzon = sources.value.length === 0 || sources.value.includes('ozon');
  if (isPim || !props.isEdit) {
    tab.value = 'pim'
  } else if (isOzon) {
    tab.value = 'ozon'
  } else {
    tab.value = 'wb'
  }
  
  if (props.isEdit) {
    productId.value = route.params.id;
    store.getCard(productId.value, 'pim');
    userStore.getUsers();
  }
  id.value = route.params.id ? route.params.id : null;
  isLoaded.value = true
})

</script>

<style scoped lang="scss">
.product {
    &-header {
      &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px
      }
        &__list {
            display: flex;
            align-items: center;
        }

        &__status {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #EAEAEA;
            margin-right: 8px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 80px;
        }

        &__substatus {
            display: flex;
            font-size: 12px;
            line-height: 1;
            align-items: center;
        }
        &__input {
          max-width: 550px;
        }
    }
  &-info {
    display: inline-block;
    max-width: 1000px;
    width: 100%;
    margin-right: 6px;
    &__text {
      font-size: 14px;
      font-weight: bold;
      margin-right: 12px;
    }
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__union {
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;
    }
  }
  &-unions {
    &__container {
      max-width: 800px;
      padding-top: 8px;
    }
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__content {
      margin-bottom: 8px;
    }
    &__table {
      padding: 0 0 16px;
    }
  }
  &-actions {
    &__container {
      display: flex;
      justify-content: end;
      padding-right: 16px;
    }
    &__buttons {
      position: fixed;
      bottom: 20px;
      z-index: 1;
    }
    &__button {
      opacity: 0.8;
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;
      &--orange {
        background-color: #F98100;
        color: #fff;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  &-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 6px;
    &__container {
      background-color: #F3F3F3;
      border-radius: 100px;
      &--active {
        background-color: rgb(98, 0, 234, 0.1);
      }
    }
    &__item {
      border-radius: 100px;
      text-transform: none;
      letter-spacing: normal;
      font-size: 16px;
    }
    &__icon {
      max-width: 5px !important;
      max-height: 5px !important;
      margin-left: 2px;
      display: flex;
      align-self: start;
    }
  }
  &-preloader {
    display: flex;
    justify-content: center;
    margin-top: 70px;
  }      
}
.header {
  &-names {
    max-width: 550px;
    width: 100%;
  }
  &-attributes {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    column-gap: 12px;
    max-height: 170px;
    margin-right: 12px;
  }
    &-title {
        margin-bottom: 2px;
        font-size: 14px;
    }

    &-container {
        display: flex;
    }

    &-primary {
      display: flex;
      gap: 12px;
        &__attributes {
            display: flex;
        }
        &__name {
            max-width: 550px;
            width: 100%;
        }
    }

    &-secondary {
        display: flex;
        flex-direction: column;
        max-width: 640px;
        width: 100%;
        margin-top: 10px;

        &__select {
            max-width: 140px;
        }

        &__item {
            margin-right: 8px;
            width: 100%;
            max-width: 228px;
            max-height: 84px;
            height: 100%;
        }
        &__unit {
            max-width: 140px;
        }
        &__sku {
            margin-bottom: 24px;
        }
    }
}

.v-icon {
  max-width: 20px;
  max-height: 20px;
}
.status {
    &-container {
        display: flex;
        align-items: center;
        max-height: 38px;
        height: 100%;
        margin-top: 22px;
    }

    &-active {
        color: #F98100;
        border-color: #F98100;
        margin-right: 4px;
    }

    &-list {
        display: flex;
        align-items: center;
        height: 100%;
    }

    &-icon {
        margin-right: 4px;

        &__dot {
            max-width: 5px !important;
            max-height: 5px !important;
            margin-right: 2px;
        }
    }

    &-button {
        padding: 8px;
        text-transform: none;
        background-color: #F3F3F3;
        letter-spacing: normal;
    }
}
</style>