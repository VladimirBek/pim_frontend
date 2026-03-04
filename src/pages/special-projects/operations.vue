<template>
  <div class="operations">
    <h3 class="operations-header">Операции по складу</h3>
    <div class="operations-settings">
      <div class="operations-filter__container">
        <div class="operations-filter__field">
          <v-combobox v-model="selectedProductId" :items="products" item-title="product_name" item-value="id"
            label="Продукт" clearable density="compact" variant="outlined"></v-combobox>
          </div>
          <div class="operations-filter__field">
          <v-combobox v-model="selectedUserId" :items="users" item-title="fullname" item-value="id"
            label="Сотрудник" clearable density="compact" variant="outlined"></v-combobox>
        </div>
        <div class="operations-filter__field">
          <v-select
          v-model="selectedOperationType" :items="['Зачисление', 'Списание']" label="Тип операции" density="compact" variant="outlined"></v-select>
        </div>
        <div class="operations-filter__field">
          <v-date-input v-model="dateFrom" v-model:menu="menuFrom" prepend-icon="" :hide-actions="true" hide-details
            prepend-inner-icon="$calendar" label="Выберите дату от" placeholder="дд.мм.гггг" density="compact"
            variant="outlined" @update:model-value="menuFrom = false"></v-date-input>
        </div>
        <div class="operations-filter__field">
          <v-date-input v-model="dateTo" v-model:menu="menuTo" prepend-icon="" :hide-actions="true" hide-details
            prepend-inner-icon="$calendar" label="Выберите дату до" placeholder="дд.мм.гггг" density="compact"
            variant="outlined" @update:model-value="menuTo = false"></v-date-input>
        </div>
      </div>
      <div class="operations-search">
        <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Поиск по результату фильтрации" single-line hide-details
          density="compact" variant="outlined" />
      </div>
    </div>
    <v-data-table :headers="headers" :search="search" :items="operationsList" :items-per-page="50"
      :items-per-page-options="[10, 20, 50, 100]">
    </v-data-table>
  </div>
</template>
<script setup>
import { restApi } from '@/restApi/restMethods.vue';
import { VDateInput } from 'vuetify/labs/VDateInput';

definePage({
  meta: {
    title: 'Операции по складу',
    drawerIndex: 1,
  },
})

const headers = ref([
  { title: 'Товар', key: 'product_name' },
  { title: 'Бренд', key: 'brand.name' },
  { title: 'Количество', key: 'quantity' },
  { title: 'Артикул 1С', key: 'one_c_id' },
  { title: 'Штрихкод', key: 'bk' },
  { title: 'Сотрудник', key: 'barcode_user_name' },
  { title: 'Действие', key: 'operation_type' },
  { title: 'Дата', key: 'operation_date_str' },
]);
const operationsList = ref([]);
const dateTo = ref(null);
const menuTo = ref(false);
const dateFrom = ref(null);
const menuFrom = ref(false);
const search = ref('');
const selectedProductId = ref(null);
const selectedUserId = ref(null);
const selectedOperationType = ref(null);

const products = computed(() => {
  const map = new Map()

  operationsList.value.forEach(op => {
    const key = op.one_c_id
    if (!key) return

    if (!map.has(key)) {
      map.set(key, {
        id: op.id,
        one_c_id: op.one_c_id,
        product_name: op.product_name,
        brand: op.brand?.name || ''
      })
    }
  })

  return Array.from(map.values())
})

const users = computed(() => {
  const map = new Map()
  operationsList.value.forEach(op => {
    const userId =
      op.barcode_user?.id ||
      op.barcode_user_id ||
      null

    if (!userId) return

    if (!map.has(userId)) {
      map.set(userId, {
        id: userId,
        fullname:
          op.barcode_user?.fullname ||
          op.barcode_user_fullname ||
          op.barcode_user_name ||
          '',
      })
    }
  })

  return Array.from(map.values())
})

const formatDateParam = (value) => {
  if (!value) return null

  if (typeof value === 'string') {
    if (value.includes('T')) {
      return value.split('T')[0] // "2025-11-23T21:00:00.000Z" => "2025-11-23"
    }
    return value // типа "2025-11-24"
  }

  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return value
}

const buildQuery = (filters) => {
  const params = {}

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return

    if ((key === 'product_id' || key === 'barcode_user_id') && typeof value === 'object') {
      params[key] = value.id
      return
    }

    if (key === 'date_from' || key === 'date_to') {
      const formatted = formatDateParam(value)
      if (formatted) {
        params[key] = formatted
      }
      return
    }

    params[key] = value
  })

  return params
}
const getOperationsList = () => {
  const params = buildQuery({
    operation_type: selectedOperationType.value,
    barcode_user_id: selectedUserId.value,
    product_id: selectedProductId.value,
    date_to: dateTo.value,
    date_from: dateFrom.value,
  })
  restApi.get(`/barcode_scanner/operations/`, { params }).then(res => {
    operationsList.value = res.data.flatMap(operation => {
      const { barcode_user, operation_type, operation_date, operation_date_str } = operation
      return operation.products.map(product => ({
        ...product,
        operation_type,
        operation_date,
        operation_date_str,
        barcode_user_name: barcode_user?.fullname || '',
        barcode_user_id: barcode_user?.id ?? null,
        barcode_user_email: barcode_user?.email || '',
        barcode_user_department: barcode_user?.department || '',
        barcode_user_job_title: barcode_user?.job_title || '',
      }))
    })
  })
}

let timeoutId

const refreshOperations = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    getOperationsList()
  }, 300)
}

watch(
  [selectedProductId, selectedUserId, selectedOperationType, dateFrom, dateTo],
  () => {
    refreshOperations()
  },
  { immediate: true }
)

onMounted(() => {
  restApi.get(`/barcode_scanner/operations/`).then(res => {
    operationsList.value = res.data.flatMap(operation => {
      const { barcode_user, operation_type, operation_date, operation_date_str } = operation
      return operation.products.map(product => ({
        ...product,
        operation_type,
        operation_date,
        operation_date_str,
        barcode_user_name: barcode_user?.fullname || '',
        barcode_user_id: barcode_user?.id ?? null,
        barcode_user_email: barcode_user?.email || '',
        barcode_user_department: barcode_user?.department || '',
        barcode_user_job_title: barcode_user?.job_title || '',
      }))
    })
  })
});

</script>
<style lang="scss">
.operations {
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
    flex-direction: column;
  }

  &-filter {
    &__container {
      display: flex;
      flex-direction: row;
    }
    &__field {
      width: 100%;
      margin-right: 8px;
      max-width: 320px;
    }
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
