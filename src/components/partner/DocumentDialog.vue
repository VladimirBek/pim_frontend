<template>
    <v-snackbar v-model="snackbarShown" location="top" color="green">Публикации прикреплены</v-snackbar>
    <v-dialog v-if="props.isShown" :model-value="props.isShown" :width="type === 'act' ? 940 : 1960" persistent>
        <v-card class="document-container">
            <div class="document-container__header">
                Создание {{ props.type === 'application' ? 'приложения и счёта' : 'акта' }}
            </div>
            <div v-if="props.type === 'application'">
                <div class="document-section">
                    <div class="document-field">
                        <div class="document-field__header">Фамилия</div>
                        <div>
                            {{ store.document.counterparty_surname }}
                        </div>
                    </div>
                    <div class="document-field">
                        <div class="document-field__header">Имя</div>
                        <div>
                            {{ store.document.counterparty_name }}
                        </div>
                    </div>
                    <div class="document-field">
                        <div class="document-field__header">Отчество</div>
                        <div>
                            {{ store.document.counterparty_middle_name }}
                        </div>
                    </div>
                    <div class="document-field">
                        <div class="document-field__header">email</div>
                        <v-select
                          v-model="store.document.email"
                          placeholder="Выбрать email"
                          variant="outlined"
                          :items="store.selectedPartner.blogger_offer.email"
                          density="compact">
                            {{ store.document.counterparty_middle_name }}
                        </v-select>
                    </div>
                </div>
                <div v-for="row in store.document.rows" :key="row.id" class="document-section">
                    <div class="document-field">
                        <div class="document-field__header">Место распространения рекламы</div>
                        <v-combobox
                        :model-value="row.advertisement_place" :items="placements"
                        placeholder="Место распространения рекламы" hide-details variant='outlined' density="compact"
                        @update:model-value="store.setPlace($event, row)"></v-combobox>
                    </div>
                    <div v-if="row.advertisement_place" class="document-section">
                        <div class="document-field--small">
                            <div class="document-field__header">Аккаунт</div>
                            <v-text-field
                                :model-value="row.account" placeholder="Аккаунт"
                                density="compact" variant="outlined" single-line hide-details
                                @update:model-value="row.account = $event">
                            </v-text-field>
                        </div>
                        <div class="document-field--small">
                            <div class="document-field__header">По ссылке</div>
                            <v-text-field
                                :model-value="row.advertisement_link" placeholder="Ссылка"
                                density="compact" variant="outlined" single-line hide-details
                                @update:model-value="row.advertisement_link = $event">
                            </v-text-field>
                        </div>
                        <div class="document-field">
                            <div class="document-field__header">Характеристики рекламы</div>
                            <v-combobox
                                :model-value="row.advertisement_characteristic"
                                :items="characteristics.get(row.advertisement_place)" placeholder="Характеристики рекламы"
                                hide-details variant='outlined' density="compact"
                                @update:model-value="row.advertisement_characteristic = $event"></v-combobox>
                        </div>
                        <div class="document-field--small">
                            <div class="document-field__header">Дата публикации</div>
                            <v-text-field
                                :model-value="row.date_of_publication" placeholder="Дата публикации" density="compact"
                                type="date" variant="outlined" hide-details @update:model-value="row.date_of_publication = $event">
                            </v-text-field>
                        </div>
                        <div class="document-field">
                            <div class="document-field__header">Период распространения рекламы</div>
                            <v-text-field
                                :model-value="row.period_of_distribution" placeholder="в формате 2 часа/3 дня" density="compact"
                                variant="outlined" hide-details @update:model-value="row.period_of_distribution = $event">
                            </v-text-field>
                        </div>
                        <div v-if="row.advertisement_characteristic === 'Видеоинтеграция'" class="document-section">
                            <div class="document-field">
                                <div class="document-field__header">Хронометраж</div>
                                <v-combobox
                                    :model-value="row.timer" :items="['До 90 секунд', 'Не менее 90 секунд']" placeholder="Выбрать" density="compact"
                                    variant="outlined" hide-details @update:model-value="row.timer = $event">
                                </v-combobox>
                            </div>
                            <div class="document-field--small">
                                <div class="document-field__header">Участие исполнителя</div>
                                <v-combobox
                                    :model-value="row.participation" :items="['Да', 'Нет']" placeholder="Выбрать" density="compact"
                                    variant="outlined" hide-details @update:model-value="row.participation = $event">
                                </v-combobox>
                            </div>
                        </div>
                        <div class="document-field--small">
                            <div class="document-field__header">Цена</div>
                            <v-text-field
                                :model-value="row.price" placeholder="Указать стоимость в рублях" density="compact"
                                variant="outlined" hide-details @update:model-value="row.price = Number($event)">
                            </v-text-field>
                        </div>
                    </div>
                    <v-btn icon="mdi-delete-empty-outline" size="x-small" @click="store.deleteRow(row)"></v-btn>
                </div>
                <div>
                    <v-btn class="document-button" @click="store.addRows">Добавить место</v-btn>
                </div>
                <div class="document-summary">
                    Общая стоимость услуг: {{ store.getSummaryPrice }}
                </div>
                <div class="document-button__container">
                    <v-btn class="document-button" @click="$emit('closeDialog')" >Отмена</v-btn>
                    <v-btn color="primary" class="document-button" @click="sendApplication('save')">Сохранить</v-btn>
                    <v-btn v-if="props.role === 'doc'" color="primary" class="document-button" @click="sendApplication('send')">Отправить</v-btn>
                </div>
            </div>
            <div v-else>
                <div class="document-field__act">
                    <div class="document-field">
                        <div class="document-field__header">email</div>
                        <v-select
                          v-model="store.document.email"
                          placeholder="Выбрать email"
                          variant="outlined"
                          :items="store.selectedPartner.blogger_offer.email"
                          density="compact">
                            {{ store.document.counterparty_middle_name }}
                        </v-select>
                    </div>
                    <div class="document-field">
                        <div class="document-field__header">Приложение</div>
                        <v-select :items="store.createdAttachments" item-title='document_name' item-value="blogger_file_id" density="compact" variant="outlined" @update:model-value="store.act.offer_attachment_file_id = $event"/>
                    </div>
                    <div v-if="store.act.offer_attachment_file_id" class="document-field">
                        <div class="document-field__header">Файлы с публикациями</div>
                        <v-file-input
                            :model-value="store.publication_files" placeholder="Прикрепите файлы с публикациями" chips density="compact"
                            variant="outlined" multiple @update:model-value="store.publication_files = $event">
                        </v-file-input>
                    </div>
                </div>
                <div class="document-button__container">
                    <v-btn class="document-button" @click="$emit('closeDialog')" >Отмена</v-btn>
                    <v-btn v-if="store.act.offer_attachment_file_id" color="primary" class="document-button" @click="createPublications()">Прикрепить публикации</v-btn>
                    <v-btn v-if="props.role === 'doc'" color="primary" class="document-button" @click="sendAct()">Создать и отправить</v-btn>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { partnerStore } from '@/stores/partner';

const store = partnerStore();
const emits = defineEmits(["closeDialog"]);
const props = defineProps({
    type: {
        type: String,
        required: true,
        default: () => ""
    },
    role: {
        type: String,
        required: false,
        default: () => ""
    },
    isShown: {
        type: Boolean,
        required: true,
        default: () => false
    }
});

const placements = ref([
    "Инстаграм (Instagram)",
    "Телеграм (Telegram)",
    "Youtube",
    "Вконтакте (Vk.com)",
    "TikTok",
    "Цифровая платформа Макс (Max)",
    "Likee",
    "Дзен (Dzen)",
    "RuTube",
    "Yappy",
    "Одноклассники.ру (Ok.ru)",
]);
const snackbarShown = ref(false);

const characteristics = ref(new Map([
    [
        'Инстаграм (Instagram)', [
            'Сториз',
            'Риллс',
            'Фото-пост',
        ]
    ],
    [
        'Телеграм (Telegram)', [
            'Текстово-графический блок',
            'Видеокружок',
            'Текст',
            'Кружок + тест',
            'ТГ-история',
        ]
    ],
    [
        'Youtube', [
            'Видеоинтеграция',
            'Shorts',
            'Преролл',
        ]
    ],
    [
        'TikTok', [
            'Видео',
        ]
    ],
    [
        'Likee', [
            'Видео',
        ]
    ],
    [
        'Вконтакте (Vk.com)', [
            'ВК-клип',
            'Фото-пост в сообществе',
            'Фото-пост на личной странице',
            'Видео-пост в сообществе',
            'Видео-пост на личной странице',
            'ВК-видео интеграция',
            'ВК-видео преролл',
            'ВК-история',
        ]
    ],
    [
        'Дзен (Dzen)', [
            'Текстово-графический блок',
        ]
    ],
    [
        'RuTube', [
            'Видеоинтеграция',
            'Преролл',
        ]
    ],
    [
        'Yappy', [
            'Видео-пост',
        ]
    ],
    [
        'Одноклассники.ру (Ok.ru)', [
            'Фото-пост в сообществе',
            'Фото-пост на личной странице',
        ]
    ],
    [
        'Цифровая платформа Макс (Max)', [
          'Текстово-графический блок',
        ]
    ],
]))
const sendApplication = async (type: string) => {
    type === 'save' ? await store.saveApplication(props.role) : await store.sendApplication();
    emits("closeDialog")
}
const createPublications = () => {
    store.createPublications();
    store.publication_files = [];
    snackbarShown.value = !snackbarShown.value
    if (props.role !== 'doc') {
        emits("closeDialog")
    }
}
const sendAct = async () => {
    await store.sendAct()
    emits("closeDialog")
}

const selectAttachment = (id) => {
    store.act.offer_attachment_file_id = id
}
</script>

<style lang="scss">
.document {
    &-container {
        padding: 16px;

        &__header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 12px;
        }
    }
    &-button {
        text-transform: none;
        letter-spacing: normal;
        text-decoration: none;
        font-size: 16px;
        margin-right: 8px;
        &__container {
            display: flex;
            justify-content: end;
        }
    }
    &-field {
        max-width: 300px;
        margin-right: 8px;
        margin-bottom: 12px;
        width: 100%;
        &--small {
            margin-right: 8px;
            margin-bottom: 12px;
            max-width: 152px;
            width: 100%;
        }
        &__header {
            font-size: 14px;
            font-weight: bold;
            color: rgba(0, 26, 52, 0.6);
        }
        &__act {
            display: flex;
            margin-bottom: 12px;
            width: 100%;
        }
    }
    &-section {
        display: flex;
        align-items: center;
        width: 100%;
    }
    &-summary {
        padding: 12px;
        display: flex;
        justify-content: end;
        font-weight: bold;
    }
}
</style>