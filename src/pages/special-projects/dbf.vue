<template>
  <div class="dbf-container">
    <div class="dbf-header">
      <h1 class="dbf-header__title">Формирование DBF файла</h1>
      <h3 class="dbf-header__subtitle">Создайте документы на основе выбранных счетов и заказов</h3>
    </div>
    <div class="dbf-flow">
      <div v-for='step in steps' :key="step.number" class="dbf-flow__item"
        :class="{ 'is-inactive': step.number > activeStep }">
        <div class="dbf-flow__number">{{ step.number }}</div>
        <div class="dbf-flow__name">{{ step.name }}</div>
      </div>
    </div>
    <div class="dbf-step">
      <div class="dbf-step__header">Шаг 1: Выбор контрагента</div>
      <div class="dbf-step__content">
        <div class="dbf-contractor__section">
          <div class="dbf-contractor__search">Выберите контрагента</div>
          <v-combobox :items="contractors" item-title="fullname" prepend-inner-icon="mdi-magnify" density="compact"
            variant="outlined" placeholder="Контрагенты" hide-details
            @update:model-value="setContractor($event)"></v-combobox>
        </div>
        <!-- <div v-if="contractor.id" class="dbf-contractor dbf-contractor__section">
          <div class="dbf-contractor__title">Выбранный контрагент</div>
          <div class="dbf-contractor__content">
            <div>Название: {{ contractor.name }}</div>
            <div>ИНН: {{ contractor.inn }}</div>
            <div>КПП: {{ contractor.kpp }}</div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="dbf-step" :class="{ 'is-dimmed': activeStep < 2 }">
      <div class="dbf-step__header">Шаг 2: Выбор счетов и заказов</div>
      <div class="dbf-step__content">
        <div class="dbf-date__section">
          <div class="dbf-date__block">
            <div class="dbf-date__subtitle">Дата счетов от</div>
            <v-date-input v-model="dateFrom" v-model:menu="menuFrom" prepend-icon="" :hide-actions="true" hide-details
              prepend-inner-icon="$calendar" label="Выберите дату" placeholder="дд.мм.гггг" density="compact"
              variant="outlined" @update:model-value="menuFrom = false"></v-date-input>
          </div>
          <div class="dbf-date__block">
            <div class="dbf-date__subtitle">Дата счетов до</div>
            <v-date-input v-model="dateTo" v-model:menu="menuTo" prepend-icon="" :hide-actions="true" hide-details
              prepend-inner-icon="$calendar" label="Выберите дату" placeholder="дд.мм.гггг" density="compact"
              variant="outlined" @update:model-value="menuTo = false"></v-date-input>
          </div>
          <div class="dbf-date__block">
            <v-btn class="button" @click="getInvoices()">Получить</v-btn>
          </div>
        </div>
        <div v-if="activeStep === 3">
          <div>
            <div>Счета</div>
            <v-text-field v-model="invoiceSearch" append-inner-icon="mdi-magnify" label="Поиск" single-line hide-details
              density="compact" variant="outlined" class="mb-4"></v-text-field>
            <v-data-table v-model="selectedInvoice" item-value="name" :headers="invoiceHeaders" :items="invoiceList"
              :search="invoiceSearch" density="compact" show-select select-strategy="single">
            </v-data-table>
          </div>
          <div>
            <div>
              Заказы
            </div>
            <v-text-field v-model="orderSearch" append-inner-icon="mdi-magnify" label="Поиск" single-line hide-details
              density="compact" variant="outlined" class="mb-4"></v-text-field>
            <v-data-table v-model="selectedOrders" :headers="orderHeaders" :items="orderList" :search="orderSearch"
              density="compact" show-select>
            </v-data-table>
          </div>
        </div>
      </div>
    </div>
    <div class="dbf-step" :class="{ 'is-dimmed': activeStep < 3 }">
      <div class="dbf-step__header">Шаг 3: Выгрузка документа</div>
      <div v-if="activeStep === 3" class="dbf-step__content">
        <div class="dbf-document__content">
          <div class="dbf-document__block">
            <div class="dbf-document__title">Контрагент</div>
            <div>
              {{ contractor.fullname }}
            </div>
          </div>
          <div class="dbf-document__block">
            <div class="dbf-document__title">Счёт</div>
            <div>
              {{ selectedInvoice[0] }}
            </div>
          </div>
          <div class="dbf-document__block">
            <div class="dbf-document__title">Заказы</div>
            <div v-for="order in selectedOrders" :key="order.id">
              {{ order }}
            </div>
          </div>
        </div>
      </div>
      <div class="dbf-document__actions">
        <v-btn class="button" @click="loadDoc">Сформировать документ</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { restApi } from '@/restApi/restMethods.vue';
import { VDateInput } from 'vuetify/labs/VDateInput';

definePage({
  meta: {
    icon: 'mdi-home',
    title: 'DBF файлы',
    drawerIndex: 0,
  },
});

const steps = ref([
  {
    number: 1,
    name: 'Контрагент'
  },
  {
    number: 2,
    name: 'Счет и заказы'
  },
  {
    number: 3,
    name: 'Выгрузка'
  }
]);
const activeStep = ref(1);
const contractors = ref([
  { id: 1, fullname: 'ООО Отрада', name: 'Отрада', inn: '1234567890', kpp: '1234567890', }
])
const contractor = ref({ id: null, name: '', inn: '', kpp: '', });
const dateFrom = ref(new Date());
const dateTo = ref(new Date());
const menuFrom = ref(false);
const menuTo = ref(false);
const orderHeaders = ref([
  { title: 'Номер заказа', key: 'name' },
]);
const invoiceHeaders = ref([
  { title: 'Номер счёта', key: 'name' },
]);
const invoiceList = ref([]);
const orderList = ref([]);
const invoiceSearch = ref('');
const orderSearch = ref('');
const selectedOrders = ref([]);
const selectedInvoice = ref('');

const setContractor = (value) => {
  contractor.value = value;
  activeStep.value = 2;
}

const getInvoices = () => {
  const params = {
    date_to: dateTo.value.toISOString().split('T')[0],
    date_from: dateFrom.value.toISOString().split('T')[0],
  }
  restApi.get(`/file_handler/dbf/invoices_with_orders/?date_from=${params.date_from}&date_to=${params.date_to}&counterparty=${contractor.value.name}`).then((res) => {
    invoiceList.value = res.data.invoices
    orderList.value = res.data.kaktus_orders
    activeStep.value = 3;
  })
}

const loadDoc = () => {
  const invoiceId = invoiceList.value.find(el => el.name === selectedInvoice.value[0])
  const params = {
    invoice_id: invoiceId.id,
    kaktus_order_ids: selectedOrders.value
  }
  restApi.post('/file_handler/dbf/', params).then(res => {
    const { data, file_name } = res.data || {};
    const clean = String(data).replace(/\s+/g, '');
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const filename = (file_name && file_name.trim() ? file_name : 'file.dbf')
      .replace(/(\.dbf)?$/i, '.dbf');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  })
}
</script>

<style lang="scss">
.dbf-container {
  max-width: 1154px;
  width: 100%;
  padding: 16px;
}

.dbf {
  &-header {
    margin-bottom: 24px;

    &__title {
      font-size: 30px;
      font-family: 'Involve';
    }

    &__subtitle {
      font-family: 'Involve-bold';
      color: #475569;
    }
  }

  &-flow {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;

    &__item {
      --circle-bg: #000;
      --text-color: #0f172a;
      --line-color: #000;
      --number-color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;

      &:not(:first-child)::before {
        content: '';
        display: block;
        flex: 0 0 120px;
        height: 2px;
        background-color: var(--line-color);
        margin: 0 12px;
        align-self: center;
      }

      &.is-inactive {
        --circle-bg: #CBD5E1;
        --text-color: #475569;
        --number-color: #475569;
        --line-color: #CBD5E1;
      }
    }

    &__number {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--circle-bg);
      color: var(--number-color);
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    &__name {
      display: inline-flex;
      align-items: center;
      font-weight: 600;
      color: var(--text-color);
    }
  }

  &-step {
    padding: 32px;
    margin-bottom: 24px;
    border: 2px solid #E2E8F0;
    border-radius: 12px;

    &.is-dimmed {
      opacity: 0.5;
      pointer-events: none;
    }

    &__header {
      font-size: 20px;
      font-family: 'Involve-bold';
      margin-bottom: 16px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
  }

  &-contractor {
    background-color: #F8FAFC;
    padding: 24px;

    &__section {
      border-radius: 8px;
      max-width: 512px;
      width: 100%;
    }

    &__title {
      margin-bottom: 12px;
      font-size: 16px;
      font-family: 'Involve-bold';
    }

    &__content {
      font-size: 14px;
    }

    &__search {
      margin-bottom: 8px;
      font-size: 14px;
      color: #475569;
    }
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

  &-document {
    &__content {
      gap: 24px;
      display: flex;
      margin-bottom: 12px;
    }

    &__block {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 24px;
      width: 334px;
    }

    &__title {
      font-family: 'Involve-bold';
      font-size: 16px;
    }

    &__actions {
      display: flex;
      gap: 16px
    }
  }
}
</style>
