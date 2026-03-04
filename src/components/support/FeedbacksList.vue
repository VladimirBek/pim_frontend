<template>
  <v-text-field v-model.trim="search" append-inner-icon="mdi-magnify" label="Поиск" single-line hide-details
    density="compact" variant="outlined" class="mb-4" />
  <v-data-table :headers="headers" :search="search" items-per-page="50" :items="store.feedbacks" density="compact"
    @click:row="onRowClick">
    <template #item.created_date="{ value }">
      <div>
        {{ getDate(value) }}
      </div>
      <div>
        {{ getTime(value) }}
      </div>
    </template>
    <template #item.product_valuation="{ value }">
      <v-chip :color="getColor(value)">
        {{ value }}
      </v-chip>
    </template>
    <template #item.answer="{ value }">
      <v-chip v-if="!value" color="green">
        New
      </v-chip>
    </template>
  </v-data-table>
  <v-dialog v-if="detailShown" :model-value="detailShown" persistent height="100%">
    <v-card class="detail-container">
      <div class="mb-3">
        <div class="detail-product__name">{{ store.selectedFeedback.wb_product.product_name }}</div>
        <div class="detail-product__article">Арт. продавца: {{ store.selectedFeedback.wb_product.supplier_article }}</div>
        <div class="detail-product__article">Артикул WB: {{ store.selectedFeedback.wb_product.nm_id }}</div>
      </div>
      <div class="detail-user mb-4">
        <div class="detail-user__name"> {{ store.selectedFeedback.user_name }}</div>
        <div class="mb-1">Покупка {{ purchaseDate }}</div>
        <div class="detail-user__valuation mb-1">Оценка: <v-chip :color="getColor(store.selectedFeedback.product_valuation)">{{ store.selectedFeedback.product_valuation }}</v-chip></div>
        <div class="mb-3">
          <div class="detail-user__valuation mb-1">Недостатки которые отметил пользователь</div>
          <div class="detail-user__cons">{{ store.selectedFeedback.cons }}</div>
        </div>
        <div class="mb-3">
          <div class="detail-user__valuation mb-1">Комменатрий</div>
          <div class="detail-user__comment">{{ store.selectedFeedback.text }}</div>
        </div>
        <div v-if="store.selectedFeedback.answer" class="mb-3">
          <div class="detail-user__valuation mb-1">Ответ</div>
          <div class="detail-user__comment">{{ store.selectedFeedback.answer.answer_text }}</div>
        </div>
      </div>
      <div>
        <div class="detail-answer__header mb-2">Ответ</div>
        <v-textarea
        :model-value="store.answer.answer_text" label="Введите текст ответа" variant="outlined"
        rows="6" @update:model-value="store.answer.answer_text = $event"></v-textarea>
      </div>
      <div class="detail-actions">
        <v-btn class="mr-4" @click="detailShown = !detailShown">Закрыть</v-btn>
        <v-btn color="primary" @click="sendAnswer('feedback')">Отправить</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { supportStore } from '@/stores/support';

const store = supportStore();
const headers = ref([
  { title: 'Дата и время', key: 'created_date', width: '140px' },
  { title: 'Название товара', key: 'wb_product.product_name', sortable: false },
  { title: 'Арт. продавца', key: 'wb_product.supplier_article', width: '150px', sortable: false },
  { title: 'Арт. WB', key: 'wb_product.nm_id', width: '110px', sortable: false },
  { title: 'Оценка', key: 'product_valuation', width: '110px', align: 'center' },
  { title: 'Отзыв', key: 'text', sortable: false },
  { title: 'Статус', key: 'answer', }
]);
const search = ref('');
const detailShown = ref(false)

const purchaseDate = computed(() => {
  const date = new Date(store.selectedFeedback.wb_product.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return `${day}.${month}.${year}`
})

const getColor = (value) => {
  if (value >= 4) {
    return 'green'
  } else if (value < 3) {
    return 'red'
  } else {
    return 'orange'
  }
}

const getDate = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return `${day}.${month}.${year}`
}

const getTime = (value) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() / 60
  let hours = date.getHours() + offset;
  let minutes = date.getMinutes();
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  return `${hours}:${minutes}`
}

const onRowClick = (...args) => {
  store.selectFeedback(args[1].item.id_)
  detailShown.value = !detailShown.value
}

const sendAnswer = async (value) => {
    await store.sendAnswer(value);
    detailShown.value = !detailShown.value;
}

onMounted(() => {
  store.getFeedbacks()
})
</script>
<style lang="scss">
.support {
  &-dialog {
    right: -18px;
    top: 0;
    height: 100%;
  }
}

.detail {
  &-container {
    height: 100%;
    width: 40%;
    right: -18px;
    position: fixed;
    padding: 16px;
  }
  &-product {
    &__header {
      margin-bottom: 20px;
    }
    &__name {
      font-size: 16px;
      font-weight: bold
    }
    &__article {
      color: rgba(0, 26, 52, 0.6);
      font-size: 14px;
      font-weight: bold
    }
  }
  &-user {
    &__name {
      font-weight: bold;
    }
    &__valuation {
      font-weight: bold;
      font-size: 14px;
      color: rgba(0, 26, 52, 0.6);
    }
    &__cons {
      padding: 6px;
      background-color: rgba(22, 151, 246, 0.6);
      border-radius: 10px 10px;
      display: inline-block;
      color: #ffffffe7;
    }
  }
  &-actions {
    display: flex;
    justify-content: end;
  }
  &-answer {
    &__header {
      font-weight: bold;
    }
  }
}
</style>
