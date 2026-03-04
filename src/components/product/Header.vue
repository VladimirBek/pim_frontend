<template>
    <v-snackbar 
    v-model="snackbarShown"
    location="top"
    :timeout="1000">
    Необходимо заполнить обязательные поля для отправки на маркетплейс
    </v-snackbar>
    <v-card class="product-header">
        <v-form validate-on='submit lazy' class="header-container" @submit.prevent>
            <div class="header-primary">
                    <h3 class="header-title">Основное о товаре</h3>
                    <v-text-field 
                        v-model="productName" 
                        placeholder="Укажите название товара" 
                        density="compact"
                        class="product-header__input" 
                        variant="outlined"
                        :rules="validateRule">
                    </v-text-field>
                <div class="header-primary__shortname">
                    <h3 class="item-title">
                    Короткое имя
                    </h3>
                    <v-text-field 
                    v-model="shortName" 
                    placeholder="Укажите название товара" 
                    density="compact"
                    class="product-header__input" 
                    variant="outlined">
                    </v-text-field>
                </div>
                <div class="header-primary__attributes">
                    <div class="header-secondary__item header-secondary__unit">
                        <h3 class="item-title">
                            Юнит
                        </h3>
                        <v-select 
                            v-model="unit" 
                            placeholder="Выбрать" 
                            variant="outlined" 
                            class="header-secondary__select"
                            :items="store.unitsList" 
                            density="compact"
                            disabled
                            :rules="validateRule">
                        </v-select>
                    </div>
                    <div class="header-secondary__item">
                        <h3 class="item-title">Бренд</h3>
                        <v-select 
                            v-model="brand" 
                            placeholder="Выберите бренд" 
                            :items="store.brandsList" 
                            item-title="name"
                            variant="outlined" 
                            density="compact"                
                            :rules="validateRule"></v-select>
                    </div>
                    <div v-if="store.productLines.length > 0" class="header-secondary__item">
                        <h3 class="item-title">Продуктовая линейка</h3>
                        <v-select 
                            v-model="productLine" 
                            placeholder="Выберите линейку" 
                            :items="store.productLinesList"
                            item-title="name" 
                            item-value="name" 
                            variant="outlined"  
                            hide-details
                            density="compact"></v-select>
                    </div>
                </div>
            </div>
            <div class="header-secondary">
                <div v-if="props.isEdit" class="header-secondary__item header-secondary__sku">
                    <h3 class="item-title">
                        SKU
                    </h3>
                    <div class="item-content">
                        {{ store.pim.sku }}
                    </div>
                </div>
                <div class="status-container">
                    <div class="product-header__list">
                        <div v-for="status in store.statusList" :key="status.attributeId" class="status-list">
                            <div class="product-header__status"
                                :class="status === store.activeStatus ? 'status-active' : ''">
                                {{ status }}
                                <div 
                                v-if="status === 'Маркетплейс' && (store.activeStatus === 'Маркетплейс' || store.activeStatus === 'Продажи')"
                                class="product-header__substatus" :style="`color: ${subStatus.color}`">
                                    <v-icon 
                                    icon="custom:dot" 
                                    :color="subStatus.color"
                                    class="status-icon__dot"></v-icon>
                                    {{ subStatus.name }}
                                </div>
                            </div>
                            <v-icon v-if="status === store.activeStatus && store.activeStatus !== 'Продажи'"
                                icon="custom:arrow" class="status-icon">
                            </v-icon>
                        </div>
                    </div>
                    <v-btn v-if="props.isEdit && store.activeStatus !== 'Продажи'" class="status-button"
                        @click="changeStatus()">
                        <v-icon icon="custom:check"></v-icon> Сменить статус
                    </v-btn>
                </div>
            </div>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/product';

const form = ref();
const store = useProductStore();
const snackbarShown = ref(false);

const props = defineProps({
    isEdit: {
        type: Boolean,
        required: false,
        default: () => false,
    },
});

const productName = computed({
    get() {
        const id = store.pimAttributes.find((el) => el.alias === 'name')?.attributeId;
        const attribute = store.pim.attributes?.find(el => el.attributeId === id);
        return attribute ? attribute.value : '';
    },
    set(value) {
        const attributeId = store?.pimAttributes?.find((el) => el?.alias === 'name')?.attributeId;
        const attribute = store.pim.attributes?.find((el) => el.attributeId === attributeId);
        if (attribute) {
            attribute.value = value;
        } else {
            store.pim.attributes.push({ attributeId, value });
        }
    }
});

const shortName = computed({
    get() {
        const id = store.pimAttributes.find((el) => el.alias === 'shortName')?.attributeId;
        const attribute = store.pim.attributes?.find(el => el.attributeId === id);
        return attribute ? attribute.value : '';
    },
    set(value) {
        const attributeId = store.pimAttributes.find((el) => el.alias === 'shortName').attributeId;
        const attribute = store.pim.attributes?.find((el) => el.attributeId === attributeId);
        if (attribute) {
            attribute.value = value;
        } else {
            store.pim.attributes.push({ attributeId, value });
        }
    }
});


const unit = computed({
    get() {
        const unit = store.units.find(el => el.unitId === store.pim.unitId);
        return unit ? unit.name : null;
    },
    set(value) {
        store.pim.unitId = store.units.find(el => el.name === value).unitId;
    }
});

const brand = computed({
    get() {
        const brand = store.brands.find(el => el.brandId === store.pim.brandId);
        return brand ? brand.name : null;
    },
    set(value) {
        store.pim.brandId = store.brands.find(el => el.name === value).brandId;
        store.getProductLines(store.pim.brandId);
    }
});

const productLine = computed({
    get() {
        const productLine = store.productLines.find(el => el.productLineId === store.pim.productLineId);
        return productLine ? productLine.name : null;
    },
    set(value) {
        store.pim.productLineId = store.productLines.find(el => el.name === value).productLineId;
    }
});

const subStatus = computed(() => {
    const ozonValue = store.pim.ozonStatus;
    const wbValue = store.pim.wbStatus;
    const params = {
        name: '',
        color: ''
    }
    if (ozonValue === 3 || wbValue === 3) {
        params.name = 'Ошибка',
        params.color = '#F00'
    }
    else if (ozonValue === 1 || wbValue === 1) {
        params.name = 'Отправлен',
        params.color = '#76808A'
    } else if (ozonValue === 2 || wbValue === 2) {
        params.name = 'Успешно',
        params.color = '#21C16B'
    } else {
        params.name = 'Отправлен',
        params.color = '#76808A'
    }
    return params;
});

const changeStatus = async () => {
    const index = store.statusList.indexOf(store.activeStatus);
    const statusValue = store.statusList[index+1];
    const id = store.pimAttributes?.find((el) => el.alias === 'status')?.attributeId;
    const attribute = store.pim.attributes?.find((el) => el.attributeId === id);
    const isValid = await form.value.validate();
    if ((isValid.valid && statusValue === 'В работе') || (statusValue !== 'В работе' && store.isFormValid)) {
        if (attribute) {
            attribute.value = statusValue;
        } else {
            const status = {
                attributeId: id,
                value: statusValue
            }
            store.pim.attributes.push(status);
        }
        store.saveProduct(store.pim.productId, 'pim');
    } else {
        snackbarShown.value = true;
    }
};

const validateRule = [value => {
    if (value) return true; 
    return 'Обязательно к заполнению';
}];
</script>
<style lang="scss">
.product {
    &-header {
        padding: 16px;
        font-size: 14px;
        &__input {
            max-width: 828px;
            width: 100%;
        }

        &__list {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 20px;
            height: 100%;
        }

        &__status {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #EAEAEA;
            margin-right: 8px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 80px;
        }

        &__substatus {
            display: flex;
            font-size: 12px;
            line-height: 1;
            align-items: center;

        }
    }
}

.header {
    &-title {
        margin-bottom: 10px;
        font-size: 16px;
    }

    &-container {
        display: flex;
    }

    &-primary {
        width: 100%;
        max-width: 828px;
        margin-right: 50px;
        &__attributes {
            display: flex;
        }
        &__shortname {
            max-width: 612px;
            width: 100%;
        }
    }

    &-secondary {
        display: flex;
        flex-direction: column;
        max-width: 640px;
        width: 100%;
        margin-top: 10px;

        // &__select {
        //     max-width: 140px;
        // }

        &__item {
            margin-right: 8px;
            width: 100%;
            max-width: 228px;
            max-height: 84px;
            height: 100%;
        }
        &__unit {
            max-width: 140px;
        }
        &__sku {
            margin-bottom: 24px;
        }
    }
}

.status {
    &-container {
        display: flex;
        align-items: center;
        max-height: 38px;
        height: 100%;
    }

    &-active {
        color: #F98100;
        border-color: #F98100;
        margin-right: 4px;
    }

    &-list {
        display: flex;
        align-items: center;
        height: 100%;
    }

    &-icon {
        margin-right: 4px;

        &__dot {
            max-width: 5px !important;
            max-height: 5px !important;
            margin-right: 2px;
        }
    }

    &-button {
        padding: 8px;
        text-transform: none;
        background-color: #F3F3F3;
        letter-spacing: normal;
    }
}

.item {
    &-title {
        font-size: 16px;
        font-weight: bold;
    }

    &-content {
        max-height: 38px;
        height: 100%;
        display: flex;
        align-items: center;
    }
}

// .v-select .v-field .v-field__input > input {
//     align-self: center;
// }
</style>