<template>
<v-dialog 
  v-model="$props.isDialogShown" 
  width="1024"
  @update:model-value="$emit('closeDialog')"
>
  <v-form class="dialog-container">
    <v-card>
      <v-card-title>
        <span class="text-h5">Объединение товаров</span>
      </v-card-title>
      <v-text-field 
      v-model.trim="search" 
      append-inner-icon="mdi-magnify"
      label="Поиск"
      single-line
      hide-details
      density="compact"
      variant="outlined"
      class="mb-4"></v-text-field>
      <v-data-table 
      :headers="tableHeaders" 
      :items="tableItems" 
      :search="search" 
      density="compact"
      @click:row="setUnion">
      <template v-slot:item.status="{ item }">
        {{ chosenProducts.includes(item.productId) ? '&check;' : '' }}
      </template>
      </v-data-table>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('closeDialog')">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</v-dialog>
</template>

<script setup lang="ts">

import { useProductStore } from '@/stores/product';

const store = useProductStore();

const tableHeaders = ref([
  { title: 'SKU', key: 'sku' },
  { title: 'НАЗВАНИЕ', key: 'name' },
  { title: 'Добавлен', key: 'status', value: 'status', sortable: false }
]);

const search = ref('');
const emits = defineEmits(["closeDialog"]);
const props = defineProps({
  isDialogShown: {
    type: Boolean,
    required: true,
    default: () => false
  },
  source: {
    type: String,
    required: true,
    default: () => ''
  },
});

const chosenProducts = computed(() => {
  if (props.source === 'pim') {
    return store.pim.union
  } else if (props.source === 'ozon') {
    return store.ozon.union
  } else {
    return store.wildberries.union 
  }
});

const setUnion = (...args) => {
  const productId = args[1].item.productId
  if (!chosenProducts.value.includes(productId)) {
    if (props.source === 'pim') {
      store.pim.union.push(productId)
    } else if (props.source === 'ozon') {
      store.ozon.union.push(productId)
    } else {
      store.wildberries.union.push(productId)
    }
  } else {
    if (props.source === 'pim') {
      store.pim.union = store.pim.union.filter(id => id !== productId)
    } else if (props.source === 'ozon') {
      store.ozon.union = store.ozon.union.filter(id => id !== productId)
    } else {
      store.wildberries.union = store.wildberries.union.filter(id => id !== productId)
    }
  }
};

const tableItems = computed(() => {
  if (props.source === 'pim') {
    return store.pimProducts
  } else if (props.source === 'ozon') {
    return store.ozonProducts
  } else {
    return store.wbProducts
  }
});
</script>

<style scoped>
.dialog-container {
  overflow: scroll;
}
</style>