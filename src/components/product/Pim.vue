<template>
  <div>
    <div class="product-kit__container">
      <div class="product-kit__category">
        <p>Категория</p> 
        <v-combobox 
        v-model="category"
        label="Выберите категорию" 
        :items="store.pimCategories" 
        placeholder="Не выбрана"
        variant="outlined" 
        density="compact" 
        item-title="name"></v-combobox>
      </div>
        <v-checkbox
      :model="store.pim.isKit"
      hide-details
      class="product-kit__checkbox"
      label="Комплект"
      density="compact"
      :disabled="props.isEdit"
      @click="setKit()">
      </v-checkbox>
    </div>
    <div>
      <div v-for="group in store.pimGroups" :key="group.groupId" class="product-attribute__group">
        {{ group.name }}
        <div v-for="subGroup in group.groups" :key="group.tabId">
          <div class="product-attribute__container">
            <div v-for="attribute in subGroup.attributes" :key="attribute.attributeId" class="product-attribute__item">
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
              <Input 
              v-if="attribute.pimType !== 'datetime'"
              :model="getAttributeValue(attribute)"
              :disabled="attribute.isReadOnly"
              :rules="attribute.isRequired ? validateRule : []"
              @update="setAttributeValue($event, attribute)"/>
              <Input
              v-else
              :model="getAttributeValue(attribute)"
              :type="'date'"
              :min="'2023-01-01'"
              :max="'2031-01-01'"
              :rules="attribute.isRequired ? validateRule : []"
              @update="setAttributeValue($event, attribute)"/>
            </div>
          </div>
          <div class="product-actions__container">
            <div  v-if="props.isEdit" class="product-actions__buttons">
              <v-btn class="me-2 product-actions__button" :to="'/product/products'">
                Отменить
              </v-btn>
              <v-btn class="product-actions__button" color="primary" @click="saveProduct()">
                Обновить PIM
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import Input from '../ui/Input.vue';

const route = useRoute();
const store = useProductStore();

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const category = computed({
  get() {
    return store.pimCategories.find(el => el.id === store.pim.catalogId)?.name;
  },
  set(value) {
    store.pim.catalogId = value.id;
  },
});

const getAttributeValue = (attribute) => {
  return store.pim.attributes?.find(el => el.attributeId === attribute.attributeId)?.value;
};

const setAttributeValue = (value, attr) => {
  const attribute = store.pim.attributes?.find(el => el.attributeId === attr.attributeId);
  if (attr.pimType === 'integer' && value !== null) {
    value = value.replace(/\D/g, '');
  }
  if (attribute) {
    value !== null ? attribute.value = value : attribute.value = '';
  } else {
    store.pim.attributes.push({
      attributeId: attr.attributeId,
      value: value,
    });
  }
};

const setKit = () => {
  store.pim.productLineId = null;
  store.pim.isKit = !store.pim.isKit
  if (!store.pim.isKit) {
    store.pim.union = []
  }
}

const saveProduct = async () => {
  await store.saveProduct(store.pim.productId, 'pim');
};

const validateRule = [(value) => {
  if (value) return true;
  return 'Обязательно к заполнению';
}];


onMounted(async () => {
  await store.getCatalogs('pim');
  await store.getGroups('pim'); 
  await store.getProducts('pim');
  if (props.isEdit) {
    await store.getHistory('pim', route.params.id, 1, 1)
  }
});
</script>
<style scoped lang="scss">
.product {
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
      column-gap: 12px;
      flex-wrap: wrap;
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
  &-group {
    &__name {
      font-weight: bold;
      margin-bottom: 8px;
    }
  }
  &-container {
    display: flex;
    align-items: start;
  }
  &-button {
    max-width: 240px;
    width: 100%;
    padding: 6px 8px;
    text-transform: none;
    background-color: #F3F3F3;
    letter-spacing: normal;
  }
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
  &-tabs {
    display: flex;
    &__container {
      background-color: #F3F3F3;
      border-radius: 100px;
      &--active {
        background-color: rgb(98, 0, 234, 0.1);
      }
    }
    &__item {
      border-radius: 100px;
      text-transform: none;
      letter-spacing: normal;
      font-size: 16px;
    }
    &__icon {
      max-width: 5px !important;
      max-height: 5px !important;
      margin-left: 2px;
      display: flex;
      align-self: start;
    }
  }
  &-substatus {
    &__item {
      border-radius: 0;
    }
  }
  &-preloader {
    display: flex;
    justify-content: center;
    margin-top: 70px;
  }
  &-kit {
    &__category {
      max-width: 680px;
      width: 100%;
    }
    &__container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__checkbox {
      max-width: 120px;
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
  
.v-icon {
  max-width: 20px;
  max-height: 20px;
}
</style>