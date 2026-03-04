<template>
    <v-container v-if="link.stat" fluid>
        <h2 class="mb-6"> {{ shownlink }}</h2>
        <v-row>
            <v-col cols="5">
                <v-card class="link-containter">
                    <div class="link-stat__container">
                        <div class="link-original__container">
                            <h3  class="link-stat__date">Исходная ссылка</h3>
                            <p> {{  link.originalLink }} </p>
                        </div>
                        <div class="link-original__container">
                            <h3  class="link-stat__date">Поисковая фраза</h3>
                            <p> {{  link.phrase }} </p>
                        </div>
                        <div class="link-stat__list">
                            <div class="link-stat__item">
                                <h3 class="link-stat__title">Количество переходов</h3>
                                <p class="link-stat__content"> {{ link.stat.totalLinkFollows }} </p>
                            </div>
                            <div class="link-stat__item">
                                <h3 class="link-stat__title">Количество покупок</h3>
                                <p class="link-stat__content"> {{ link.stat.salesCount }} </p>
                            </div>
                            <div class="link-stat__item">
                                <h3 class="link-stat__title">Средние продажи за месяц</h3>
                                <p class="link-stat__content"> {{ link.stat.monthAverageSales }}</p>
                            </div>
                            <div class="link-stat__item">
                                <h3 class="link-stat__title">Селлерская цена</h3>
                                <p class="link-stat__content"> {{ link.stat.sellerPrice }} </p>
                            </div>
                        </div>
                        <div>
                            <h3 class="link-date__title">Скачать файл статистики за период</h3>
                            <p class="link-date__content">Выберите даты</p>
                            <div class="link-stat__date">
                                <Input 
                                    :model="dateFrom"
                                    :label="'Дата отсчета'"
                                    type='date'
                                    min='2023-01-01'
                                    class="link-stat__input"
                                    @update="dateFrom = $event"/>
                                <Input 
                                    :model="dateTo"
                                    :label="'Дата окончания'"
                                    type='date'
                                    min='2023-01-01'
                                    class="link-stat__input"
                                    @update="dateTo = $event"/>
                            </div>
                            <v-btn v-if="dateFrom || dateTo" download :href="downloadRoute" class="link-button__primary"> 
                                Выгрузить
                            </v-btn>
                            <v-btn class="link-button__primary" @click="productRedirect()"> 
                                Перейти в товар
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import router from '@/plugins/router';
import { restApi } from '@/restApi/restMethods.vue';

const link = ref({});
const dateFrom = ref('');
const dateTo = ref('');

const shownlink = computed(() => `Информация о ссылке ${link.value.link}`);
const downloadRoute = computed(() => {
    let route = `/api/v1/mobzio/excel?source=stat&linkId=${link.value.linkId}`
    if (dateFrom.value && dateTo.value) {
        route = route + `&dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`
    } else if (dateFrom.value) {
        route = route + `&dateFrom=${dateFrom.value}`
    } else {
        route = route + `&dateTo=${dateTo.value}`
    }
    return route
});

const productRedirect = () => {
  router.push({ path: `/catalogs/product/${link.value.productId}` })
};

onMounted(async () => {
    await restApi.post('/mobzio/link', {
        linkId: router.currentRoute.value.params.id
    }).then((res) => link.value = res.data);
})

</script>

<style scoped lang="scss">
.link {
    &-original {
        &__container {
            margin-bottom: 12px;
            font-size: 14px;
        }
    }
    &-button{
        &__primary {
            background-color: #F98100;
            color: #FFF;
            margin-right: 8px;
            text-transform: none;
            letter-spacing: normal;
            text-decoration: none;
            font-size: 16px;
        }
    }
    &-date {
        &__title {
            font-size: 16px;
        }
        &__content {
            margin-bottom: 8px;
            font-size: 14px;
        }
    }
    &-stat {
        &__container {
            padding: 16px;
        }
        &__list {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        &__item {
            max-width: 150px;
        }
        &__title {
            font-size: 16px;
            min-height: 48px;
        }
        &__content {
            font-size: 14px;
        }
        &__date {
            display: flex;
        }
        &__input {
            max-width: 150px;
            width: 100%;
            &:first-child {
                margin-right: 12px;
            }
        }
    }
}
</style>