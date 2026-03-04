<template>
  <div class="offer-search">
    <v-text-field
    v-model="search"
    append-inner-icon="mdi-magnify"
    label="Поиск"
    single-line
    hide-details
    density="compact"
    variant="outlined"/>
  </div>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="store.offersList"
    items-per-page="50"
    @click:row="onRowClick">
    <template #item.status="{value}">
      <v-chip :color="statusColor(value)">
        {{ value }}
      </v-chip>
    </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { offerStore } from '@/stores/offer';
import router from '@/plugins/router';

definePage({
  meta: {
    title: 'Заявки',
    icon: 'mdi-account-question-outline',
    drawerIndex: 1,
  },
})

const store = offerStore();
const headers = ref([
  { title: 'Статус', key: 'status', align:'center'},
  { title: 'Ссылка', key: 'link_advertising_platform' },
  { title: 'Фамилия', key: 'surname' },
  { title: 'Имя', key: 'name' },
  { title: 'Отчество', key: 'middle_name' },
  { title: 'ОГРНИП',  key: 'ogrn' },
  { title: 'ИНН',  key: 'inn' },
  { title: 'Телефон', key: 'phone[0]' },
  { title: 'Email', key: 'email[0]' },
  { title: 'Ответственный менеджер', key: 'responsible_manager_name' },
  { title: 'Комментарий', key: 'comment' },
]);
const search = ref('')

const onRowClick = (...args: { item: {[x: string]: any; id: string; }; }[]) => {
  router.push({ path: `/dms/offer/${args[1].item.id_}` })
}

const statusColor = (value: string) => {
  if (value === "New") {
    return 'red'
  } else if (value === "Принята") {
    return 'green'
  } else {
    return 'grey'
  }
}

onMounted(async () => {
  await store.getOffersList()
})

</script>

<style scoped lang="scss">
.offer {
  &-search {
    padding: 8px 8px;
    margin-bottom: 8px;
  }
}
</style>
