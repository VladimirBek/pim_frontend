<template>
    <v-snackbar 
    v-model="snackbarShown"
    location="top"
    :timeout="1000">
    Ссылка скопирована
    </v-snackbar>
    <v-dialog v-model="$props.isDialogShown" width="432" @update:model-value="$emit('closeDialog')">
        <v-form class="dialog-container">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Генерация ссылки</span>
                </v-card-title>
                <div class="dialog-container__form">
                    <div>
                        <v-combobox 
                            v-model="productSku" 
                            label="Продукт"
                            :items="products"
                            item-title='sku'
                            hide-details
                            density="compact" 
                            variant="outlined" 
                            class="mb-4">
                        </v-combobox>
                        <v-text-field 
                            v-model="link.phrase" 
                            label="Поисковая фраза" 
                            hide-details
                            density="compact" 
                            variant="outlined"
                            class="mb-4">
                        </v-text-field>
                        <v-text-field 
                            v-model="link.shortCode" 
                            label="Код ссылки" 
                            hide-details
                            density="compact" 
                            variant="outlined" 
                            class="mb-4">
                        </v-text-field>
                        <v-text-field 
                            v-model="link.blogger" 
                            label="Блоггер" 
                            hide-details
                            density="compact" 
                            variant="outlined" 
                            class="mb-4">
                        </v-text-field>
                        <div class="dialog-link">
                            <div v-if="!linkCreated">
                                <v-progress-circular v-if="linkLoading" indeterminate :size="24"></v-progress-circular>
                                <v-btn v-else color="blue-darken-1" variant="text" @click="createLink()">
                                    Создать ссылку
                                </v-btn>
                            </div>
                            <div v-else @click="copyLink()" class="dialog-link__text">
                                {{ generatedLink }} <v-icon icon="custom:copy" color="black"></v-icon>
                            </div>
                        </div>
                    </div>
                    <v-card-actions class="dialog-actions">
                        <v-btn color="blue-darken-1" variant="text" @click="clearForm()">
                            Очистить
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="$emit('closeDialog')">
                            Закрыть
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </v-form>
    </v-dialog>
</template>
    
<script setup lang="ts">

import { restApi } from '@/restApi/restMethods.vue';

const emits = defineEmits(["closeDialog"]);
const props = defineProps({
    isDialogShown: {
        type: Boolean,
        required: true,
        default: () => false
    },
});

const linkCreated = ref(false);
const snackbarShown = ref(false);
const linkLoading = ref(false);
const products = ref([]);
const link = ref({
    productId: '',
    sku: '',
    phrase: '',
    shortCode: '',
    blogger: '',
});
const generatedLink = ref('');

const productSku = computed ({   
    get() {
        return link.value.sku ? link.value.sku : null;
    },
    set (value) {
        link.value.sku = value.sku;
        link.value.productId = value.productId;
    },
});

const createLink = () => {
    linkLoading.value = !linkLoading.value
    restApi.post('/mobzio/create', {
        productId: link.value.productId.toUpperCase(),
        shortcode: link.value.shortCode,
        phrase: link.value.phrase,
        blogger: link.value.blogger,
    }).then( res => {
        generatedLink.value = res.data.link
        linkLoading.value = !linkLoading.value
        linkCreated.value = !linkCreated.value
    })
};

const copyLink = () => {
    navigator.clipboard.writeText(generatedLink.value);
    snackbarShown.value = !snackbarShown.value
};

const clearForm = () => {
    link.value = {}
    if (linkCreated.value) {
        linkCreated.value = !linkCreated.value
    }
};


onMounted(async () => {
    await restApi.post('/products', {
        source: 'pim'
    }).then(res => products.value = res.data.filter(el => {
        return el.status === 'Маркетплейс' || el.status === 'Продажи'
    }))
});
</script>
    
<style scoped lang="scss">
.dialog {
    &-container {
    overflow: scroll;
    &__form {
        flex-direction: column;
        display: flex;
        padding: 0 16px;
    }
    }
    &-actions {
        display: flex;
        justify-content: end;
        padding: 0;
    }
    &-link {
        display: flex;
        justify-content: center;
        &__text {
            cursor: pointer;
        }
    }
}
</style>