<template>
  <div class="leftovers">
    <h3 class="leftovers-header">Остатки склада</h3>
    <div class="leftovers-settings">
      <div class="leftovers-search">
        <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Поиск" single-line hide-details
          density="compact" variant="outlined" />
      </div>
      <div class="leftovers-date__block">
        <v-date-input v-model="dateTo" v-model:menu="menuTo" prepend-icon="" :hide-actions="true" hide-details
          prepend-inner-icon="$calendar" label="Выберите дату" placeholder="дд.мм.гггг" density="compact"
          variant="outlined" @update:model-value="menuTo = false"></v-date-input>
      </div>
    </div>
    <v-data-table :headers="headers" :search="search" :items="leftoversList" :items-per-page="50"
      :items-per-page-options="[10, 20, 50, 100]">
    </v-data-table>
  </div>
</template>
<script setup>
import { restApi } from '@/restApi/restMethods.vue';
import { VDateInput } from 'vuetify/labs/VDateInput';

definePage({
  meta: {
    title: 'Остатки',
    drawerIndex: 1,
  },
})

const route = useRoute();
const headers = ref([
  { title: 'Товар', key: 'product.product_name' },
  { title: 'Бренд', key: 'product.brand.name' },
  { title: 'Артикул 1С', key: 'product.one_c_id' },
  { title: 'Штрихкод', key: 'product.bk' },
  { title: 'Остаток', key: 'leftover' },
]);
const leftoversList = ref([]);
const dateTo = ref(new Date());
const menuTo = ref(false);
const search = ref('');

onMounted(() => {
  const date_to = dateTo.value.toISOString().split('T')[0]
  restApi.get(`/barcode_scanner/operations/leftovers/?date_to=${date_to}`).then(res => {
    leftoversList.value = res.data
  })
});

</script>
<style lang="scss">
.leftovers {
  font-size: 18px;

  &-header {
    font-family: 'Involve';
    margin-bottom: 4px;
  }

  &-settings {
    padding: 8px 8px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }

  &-search {
    width: 100%;
    margin-right: 8px;
  }

  &-date {
    &__subtitle {
      margin-bottom: 8px;
      font-size: 14px;
      color: #475569;
    }

    &__section {
      display: flex;
      gap: 16px;
      align-items: end;
    }

    &__block {
      width: 240px;
    }
  }
}
</style>
