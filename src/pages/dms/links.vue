<template>
  <v-container v-if="links.length > 0" fluid>
    <v-row>
      <v-col>
            <div class="links-header">
              <h4 class="links-header__title">Список ссылок</h4>
              <div class="links-header__actions">
                <v-text-field
                  v-model="search"
                  append-inner-icon="mdi-magnify"
                  label="Поиск"
                  single-line
                  hide-details
                  density="compact"
                  variant="outlined"
                  class="links-header__search"
                ></v-text-field>
                <v-btn download href="/api/v1/mobzio/excel?source=links"  class="links-button__primary links-button__link"> 
                  Выгрузить
                </v-btn>
                <v-btn class="links-button__primary" @click="isCreationShown = !isCreationShown">
                  <v-icon class="links-button__icon" color="#FFFFFF" icon="custom:plus"></v-icon>
                  <p class="links-header__link">Генерация ссылки</p>
                </v-btn>
              </div>
            </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="links"
            fixed-header
            density="compact"
            :search="search"
            class="links-table"
            :hide-default-footer="true"
            :items-per-page="pagination?.perPage"
            @click:row="onRowClick"
          >
            <template #bottom></template>
          </v-data-table>
          <v-row class="links-pagination">
                <v-col cols="7">
                  Показать по: 
                  <v-btn 
                    v-for="i in [20,50,100, 'Все']" :key="i.id"
                    variant="text" size="small"
                    :disabled="isLoading"
                    @click="changePage(i, 'perPage')">
                    <span :style="perPage === i && 'color: blue'">{{ i }}</span>
                  </v-btn>
                  | {{ pagination.pageCount }} стр.
                </v-col>
                <v-col cols="5" class="text-right">
                  <v-btn
                    v-for="i in pagesArray"
                    :key="i.id"
                    fab
                    dark
                    small
                    :color="i === page ? 'primary' : 'white'"
                    :disabled="page === i"
                    size="small"
                    class="mx-2"
                    @click="changePage(i, 'page')">
                    <div v-if="page === i">
                      {{ i }}
                    </div>
                    <v-icon v-else-if="i === page - 1">
                      mdi-less-than
                    </v-icon>
                    <v-icon v-else-if="i === page + 1">
                      mdi-greater-than
                    </v-icon>
                  </v-btn>
                </v-col>
            </v-row>
          <CreationDialog
          v-if="isCreationShown"
          :is-dialog-shown="isCreationShown"
          @close-dialog="closeDialog()"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import { restApi } from '@/restApi/restMethods.vue';
import CreationDialog from '@/components/link/CreationDialog.vue';
import { useRouter } from 'vue-router';


// definePage({
//   meta: {
//     title: 'Ссылки',
//     icon: 'mdi-link-variant',
//     drawerIndex: 3,
//   },
// })

const router = useRouter();
const search = ref('');
const links = ref([]);
const isCreationShown = ref(false);
const isLoading = ref(false);
const pagination = ref(null);
const perPage = ref(20);
const page = ref(1);

const headers = ref([
  { title: 'Сampaign', key: 'campaign' },
  { title: 'Ссылка', key: 'link' },
  { title: 'Поисковая фраза', key: 'phrase' },
  { title: 'Блогер', key: 'blogger' },
  { title: 'Всего переходов', key: 'totalLinkFollows' },
])

const changePage = (value, prop) => {
  prop === 'page' ? page.value = value : perPage.value = value
  if (value === 'Все') {
    perPage.value = pagination.value?.rowsCount
  }
  getHistory();
}

const pagesArray = computed(() => {
  const pagesButtons = []
  if (page.value > 1) {
    pagesButtons.push(page.value-1)
  }
  pagesButtons.push(page.value)
  if (page.value < pagination.value.pageCount) {
    pagesButtons.push(page.value+1)
  }
  return pagesButtons
})

const onRowClick = (...args) => {
  router.push({ path: `/catalogs/link/${args[1].item.id}` })
}

const getHistory = async () => {
  isLoading.value = !isLoading.value
  await restApi.post('/mobzio/links', {  
    page: page.value,
    perPage: perPage.value
  }).then(res => {
    isLoading.value = !isLoading.value
    pagination.value = res.data.pagination
    links.value = res.data.links.map((link) => {
      return {
        campaign: link.campaign,
        link: link.link,
        phrase: link.phrase,
        blogger: link.blogger,
        totalLinkFollows: link.stats ? link.stats.totalLinkFollows : '',
        id: link.linkId
      }
    });
  })
}

const closeDialog = async () => {
  page.value = 1
  await getHistory();
  isCreationShown.value = !isCreationShown.value
}

onMounted(() => {
  getHistory();
});

</script>

<style scoped lang="scss">
.links{
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
    }
    &__icon {
      max-width: 24px;
      max-height: 24px;
      width: 100%;
      height: 100%;
    }
    &__link {
      color: #FFF;
      margin-right: 8px;
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;
    }
  }
  &-table {
    font-size: 13px;
  }
  &-pagination {
    font-size: 14px;
    padding: 10px 16px 16px 16px;
  }
}  
</style>