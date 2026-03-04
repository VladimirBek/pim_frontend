<template>
  <div class="search-container">
    <v-combobox
      ref="comboboxRef"
      v-model="search"
      :items="limitedRequestItems"
      :custom-filter="customFilter"
      item-title="displayText"
      density='compact'
      variant="outlined"
      clearable
      hide-selected
      label="Поиск заявок"
      hide-details
      append-inner-icon="mdi-magnify"
      return-object
      :menu-props="{ maxHeight: 400 }"
      @update:model-value="onSelect"
      @keyup.enter="goToSearchResults"
      @click:append-inner="goToSearchResults"
      >
      <template v-if="showMoreResultsHint" v-slot:append-item>
        <div class="text-center py-2 text-caption">
          Всего найдено {{ totalResults }} результатов. Нажмите Enter для просмотра всех.
        </div>
      </template>
    </v-combobox>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchStore } from '@/stores/search'

const router = useRouter()
const store = searchStore()
const search = ref(null);
const comboboxRef = ref(null);

const maxVisibleItems = 7
const allRequestItems = computed(() => {
  return store.filtredRequests.map(request => {
    return {
      ...request,
      displayText: `${request.number_str} от ${request.created_at_str}. Инициатор: ${request.initiator.fullname}.`
    }
  })
})

// Ограничиваем список первыми 10 элементами
const limitedRequestItems = computed(() => {
  return store.limitedResults.map(request => {
    return {
      ...request,
      displayText: formatRequestDisplayText(request)
    }
  })
})

const formatRequestDisplayText = (request) => {
  const number = request?.number_str || 'Б/Н';
  const date = request?.created_at_str || '--';
  const initiator = request?.initiator?.fullname || 'Не указан';

  return `${number} от ${date}. Инициатор ${initiator}`;
}

// Общее количество результатов поиска
const totalResults = computed(() => allRequestItems.value.length)

// Показываем ли подсказку о дополнительных результатах
const showMoreResultsHint = computed(() => totalResults.value > maxVisibleItems)

// Настраиваем свой фильтр
const customFilter = (item, query, itemText) => {
  limitedRequestItems.value.some(el => el.displayText === item)

  // Если запрос пустой - показываем все элементы
  // if (!query || query.trim() === '') return true;

  // const queryText = query.toLowerCase().trim();

  // // Проверяем все поля, которые могут быть в поиске
  // if (item.number_str?.toLowerCase().includes(queryText)) return true;
  // if (item.title?.toLowerCase().includes(queryText)) return true;
  // if (item.description?.toLowerCase().includes(queryText)) return true;
  // if (item.initiator?.fullname?.toLowerCase().includes(queryText)) return true;
  // if (item.deadline_str?.toLowerCase().includes(queryText)) return true;
  // if (item.created_at_str?.toLowerCase().includes(queryText)) return true;

  // // Проверка в цепочке согласования
  // if (item.approval_chain?.length) {
  //   for (const stage of item.approval_chain) {
  //     if (stage.approvals?.length) {
  //       for (const approval of stage.approvals) {
  //         if (approval.user?.fullname?.toLowerCase().includes(queryText)) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  // }

  // // Проверка наблюдателей
  // if (item.observers?.length) {
  //   for (const observer of item.observers) {
  //     if (observer?.fullname?.toLowerCase().includes(queryText)) {
  //       return true;
  //     }
  //   }
  // }

  // return false;
};

const onSelect = (item) => {
  if (typeof item === 'object' && item && item.id_) {
    search.value = null
    store.searchQuery = null
    router.push(`/das/request/${item.number_str}`)
    nextTick(() => {
    const inputEl = comboboxRef.value?.$el.querySelector('input');
    if (inputEl) {
      inputEl.blur();
    }
  });
  } else {
    store.searchQuery = item
  }
}

// Обновляем поисковый запрос с debounce
// const updateSearchQuery = debounce((value) => {
//   store.searchQuery = value
// }, 200)

// // Следим за изменением поля поиска
// watch(search, (value) => {
//   if (typeof value === 'string') {
//     updateSearchQuery(value)
//   }
// })

// Переход на страницу результатов поиска
const goToSearchResults = () => {
  if (search.value) {
    store.searchQuery = search.value;
    search.value = null;
    router.push('/das/search');
    nextTick(() => {
    const inputEl = comboboxRef.value?.$el.querySelector('input');
    if (inputEl) {
      inputEl.blur();
    }
  });
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 740px;
  margin-right: 16px;
}
</style>
