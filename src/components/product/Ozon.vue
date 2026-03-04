<template>
  <div>
    <p class="mb-2">Категория</p>
    <v-combobox
      v-model="category" label="Выберите категорию" :items="store.ozonCategories" placeholder="Не выбрана"
      variant="outlined" density="compact" item-title="treePath">
    </v-combobox>
    <div v-if="store.ozonGroups && store.ozon.catalogId">
      <v-form v-if="store.ozonGroups && store.ozon.catalogId" @submit.prevent>
        <div v-for="group in store.ozonGroups" :key="group.groupId" class="product-attribute__group">
          {{ group.name }}
          <div v-for="subGroup in group.groups" :key="subGroup.tabId">
            <!-- <UploadMedia v-if="toggle === 4" pimType="ozon" /> -->
            <div class="product-attribute__container">
              <div
                v-for="attribute in subGroup.attributes" :key="attribute.attributeId"
                class="product-attribute__item">
                <div class="product-attribute__title">
                  <span class="product-attribute__name">{{ attribute.name }}</span>
                  <div v-if="attribute.description" class="product-attribute__icon">
                    <v-icon icon="custom:info">
                    </v-icon>
                    <v-tooltip class="product-attribute__tooltip" activator="parent" location="top">
                      {{ attribute.description }}
                    </v-tooltip>
                  </div>
                </div>
                <v-combobox
                  v-if="attribute.isDictionary" :model-value="getAttributeValue(attribute)"
                  :items="attribute.dictionaries" :chips="attribute.isCollection" :disabled="attribute.isReadOnly"
                  :multiple="attribute.isCollection" :rules="attribute.isRequired ? validateRule : []"
                  label="Выберите категорию" placeholder="Не выбрана" variant="outlined" density="compact"
                  item-title="name" @update:model-value="setAttributeValue($event, attribute)" />
                <v-checkbox
                  v-else-if="attribute.pimType === 'bool'" :model="getAttributeValue(attribute)"
                  :disabled="attribute.isReadOnly" density="compact" 
                  :rules="attribute.isRequired ? validateRule : []" @update:model-value="setAttributeValue($event, attribute)" />
                <v-text-field
                  v-else placeholder="Введите значение" density="compact" clearable variant="outlined"
                  :model="getAttributeValue(attribute)" :disabled="attribute.isReadOnly"
                  :rules="attribute.isRequired ? validateRule : []"
                  @update="setAttributeValue($event, attribute)" />
              </div>
            </div>
            <div class="product-actions__container">
              <div v-if="props.isEdit" class="product-actions__buttons">
                <v-btn class="me-2 product-actions__button" :to="'/product/products'">
                  Отменить
                </v-btn>
                <v-btn color="primary" type="submit" class="product-actions__button" @click="saveProduct()">
                  Обновить Ozon
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product';
import { onMounted } from 'vue';
// import UploadMedia from '@/components/product/upload/UploadMedia.vue'

const route = useRoute();
const store = useProductStore();
const toggle = ref(1);
const form = ref(null)

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const category = computed({
  get() {
    return store.ozonCategories.find(el => el.id === store.ozon.catalogId)?.treePath;
  },
  async set(value) {
    await store.getAttributes('ozon', value.id);
    store.getDictionaries('ozon', value.id);
    store.ozon.catalogId = value.id;
    await store.getGroups('ozon');
  },
});

const getAttributeValue = (attribute) => {
  return store.ozon.attributes?.find(el => el.attributeId === attribute.attributeId)?.value;
};

const setAttributeValue = (value, attr) => {
  const attribute = store.ozon.attributes?.find(el => el.attributeId === attr.attributeId);
  if (attr.pimType === 'integer' && value !== null) {
    value = value.replace(/\D/g, '');
  }
  if (attribute) {
    value !== null ? attribute.value = value : attribute.value = '';
  } else {
    store.ozon.attributes.push({
      attributeId: attr.attributeId,
      value: value,
    });
  }
};

const saveProduct = async () => {
  await store.saveProduct(store.pim.productId, 'ozon');
};

const validateRule = [(value) => {
  if (value) return true;
  return 'Обязательно к заполнению';
}];

onMounted(async () => {
  await store.getCatalogs('ozon');
  await store.getProducts('ozon');
  if (props.isEdit) {
    await store.getHistory('ozon', route.params.id, 1, 1)
    await store.getCard(route.params.id, 'ozon');
    if (store.ozon.catalogId) {
      await store.getAttributes('ozon', store.ozon.catalogId);
      await store.getDictionaries('ozon', store.ozon.catalogId);
      await store.getGroups('ozon');
    }
  };
});
</script>


<style scoped lang="scss">
.product {
  &-actions {
    &__container {
      display: flex;
      justify-content: end;
    }

    &__buttons {
      position: fixed;
      bottom: 20px;
      z-index: 1;
    }

    &__button {
      opacity: 0.8;
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;

      &:hover {
        opacity: 1;
      }
    }
  }

  &-info {
    display: inline-block;
    max-width: 1000px;
    width: 100%;
    margin-right: 6px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &-group {
    &__name {
      font-weight: bold;
      margin-bottom: 8px;
    }
  }

  &-attribute {
    &__group {
      border-bottom: 1px solid #a5a5a5;
      margin-bottom: 12px;

      &:last-child {
        border-bottom: none;
      }
    }

    &__container {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      column-gap: 12px;
    }

    &__item {
      max-width: 334px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
    }

    &__title {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 1.2;
    }

    &__name {
      margin-right: 4px;
    }

    &__icon {
      max-width: 20px;
      max-height: 20px;
      display: flex;
      align-items: center;
    }

    &__tooltip {
      max-width: 700px;
      width: 100%;
    }
  }

  &-substatus {
    &__item {
      border-radius: 0;
    }
  }

  .v-tab--selected {
    background-color: #F98100;
  }
}

.subcategory-button {
  color: inherit;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;

  &.v-btn--disabled {
    opacity: 1;
  }

  &.v-btn {
    text-transform: unset !important;

    :first-child {
      background: none;
    }
  }
}

.selected-subcategory {
  color: #F98100;
  border-bottom: 2px solid #F98100;
}

.v-combobox .v-field:not(.v-field--focused) input {
  align-self: center;
}

.v-icon {
  max-width: 20px;
  max-height: 20px;
}
</style>