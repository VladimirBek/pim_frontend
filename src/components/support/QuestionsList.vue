<template>
    <v-data-table 
        :headers="headers" :search="search" items-per-page="50" :items="store.questions" density="compact"
        @click:row="onRowClick">
        <template #item.created_date="{ value }">
            <div>
                {{ getDate(value) }}
            </div>
            <div>
                {{ getTime(value) }}
            </div>
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
            <div class="detail-product__name">{{ store.selectedQuestion.wb_product.product_name }}</div>
            <div class="detail-product__article">Арт. продавца: {{ store.selectedQuestion.wb_product.supplier_article }}</div>
            <div class="detail-product__article">Артикул WB: {{ store.selectedQuestion.wb_product.nm_id }}</div>
        </div>
        <div class="detail-user mb-4">
            <div class="detail-user__name"> {{ store.selectedQuestion.user_name }}</div>
            <div class="mb-3">
                <div class="detail-user__valuation mb-1">Вопрос</div>
                <div class="detail-user__comment">{{ store.selectedQuestion.text }}</div>
            </div>
            <div v-if="store.selectedQuestion.answer" class="mb-3">
            <div class="detail-user__valuation mb-1">Ответ</div>
            <div class="detail-user__comment">{{ store.selectedQuestion.answer.answer_text }}</div>
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
            <v-btn color="primary" @click="sendAnswer('question')">Отправить</v-btn>
        </div>
        </v-card>
    </v-dialog>

</template>
<script setup>
import { supportStore } from '@/stores/support';

const store = supportStore();
const headers = ref([
    { title: 'Дата и время', key: 'created_date', width: '140px'},
    { title: 'Название товара', key: 'wb_product.product_name', sortable: false, width: 'auto'  },
    { title: 'Арт. продавца', key: 'wb_product.supplier_article', width: '130px', sortable: false  },
    { title: 'Арт. WB', key: 'wb_product.nm_id', width: '110px', sortable: false  },
    { title: 'Вопрос', key: 'text', sortable: false  },
    { title: 'Статус', key: 'answer', }
]);
const search = ref('');
const detailShown = ref(false);

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
  store.selectQuestion(args[1].item.id_);
  detailShown.value = !detailShown.value
}

const sendAnswer = async (value) => {
    await store.sendAnswer(value);
    detailShown.value = !detailShown.value;
}

onMounted(() => {
    store.getQuestions();
});

</script>
<style lang="scss"></style>