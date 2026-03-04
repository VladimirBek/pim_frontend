<template>
  <v-container fluid>
    <h1>Детали заявки</h1>
    <div class="offer-section__container">
      <div class="offer-section__header">Личные данные</div>
      <div style="display: flex; flex-direction: column;">
        <div class="offer-personal">
          <div class="offer-personal__input">
            <div>Имя</div>
            <v-text-field
              :model-value="store.selectedOffer.name" placeholder="Введите имя блогера" density="compact"
              variant="outlined" hide-details @update:model-value="store.selectedOffer.name = $event">
            </v-text-field>
          </div>
          <div class="offer-personal__input">
            <div>Фамилия</div>
            <v-text-field
              :model-value="store.selectedOffer.surname" placeholder="Введите фамилию блогера"
              density="compact" hide-details variant="outlined" @update:model-value="store.selectedOffer.surname = $event">
            </v-text-field>
          </div>
          <div class="offer-personal__input">
            <div>Отчество</div>
            <v-text-field
              :model-value="store.selectedOffer.middle_name" placeholder="Введите отчество блогера"
              density="compact" variant="outlined" hide-details
              @update:model-value="store.selectedOffer.middle_name = $event">
            </v-text-field>
          </div>
          <div class="offer-personal__input">
            <div>ИНН</div>
            <v-text-field
              :model-value="store.selectedOffer.inn" placeholder="Введите ИНН"
              density="compact" variant="outlined" hide-details
              @update:model-value="store.selectedOffer.inn = $event">
            </v-text-field>
          </div>
          <div v-if="store.selectedOffer.ogrn" class="offer-personal__input">
            <div>ОГРНИП</div>
            <v-text-field
              :model-value="store.selectedOffer.ogrn" placeholder="Введите ОГРНИП"
              density="compact" variant="outlined" hide-details
              @update:model-value="store.selectedOffer.ogrn = $event">
            </v-text-field>
          </div>
        </div>
        <div class="offer-passport">
          <div class="offer-passport__series">
            <div>Серия паспорта</div>
            <v-text-field
              :model-value="store.selectedOffer.passport_series" placeholder="Серия паспорта"
              density="compact" variant="outlined" single-line hide-details
              @update:model-value="store.selectedOffer.passport_series = $event">
            </v-text-field>
          </div>
          <div class="offer-passport__number">
            <div>Номер паспорта</div>
            <v-text-field
              :model-value="store.selectedOffer.passport_number" placeholder="Номер паспорта"
              density="compact" variant="outlined" hide-details
              @update:model-value="store.selectedOffer.passport_number = $event">
            </v-text-field>
          </div>
          <div class="offer-passport__address">
            <div>Кем выдан</div>
            <v-text-field
              :model-value="store.selectedOffer.passport_issued" placeholder="Кем выдан" density="compact"
              variant="outlined" hide-details @update:model-value="store.selectedOffer.passport_issued = $event">
            </v-text-field>
          </div>
          <div class="offer-passport__date">
            <div>Дата выдачи</div>
            <v-text-field
              :model-value="store.selectedOffer.passport_date" placeholder="Дата выдачи" density="compact" type="date"
              variant="outlined" hide-details @update:model-value="store.selectedOffer.passport_date = $event">
            </v-text-field>
          </div>
          <div class="offer-passport__code">
            <div>Код подразделения</div>
            <v-text-field
              :model-value="store.selectedOffer.passport_code" placeholder="Код подразделения"
              density="compact" variant="outlined" hide-details
              @update:model-value="store.selectedOffer.passport_code = $event">
            </v-text-field>
          </div>
        </div>
      </div>
    </div>
    <div class="offer-section__container">
      <div class="offer-section__header">Контактная информация</div>
      <div class="offer-contact">
        <div class="offer-contact__input">
          <p>Ссылка на рекламную площадку</p>
          <v-text-field
          :model-value="store.selectedOffer.link_advertising_platform"
          placeholder="Ссылка на сайт, аккаунт в соц.сети" density="compact" variant="outlined" hide-details
            @update:model-value="store.selectedOffer.link_advertising_platform = $event">
          </v-text-field>
        </div>
        <div class="offer-contact__input">
          <div>Электронная почта</div>
          <v-text-field
          :model-value="store.selectedOffer.email" placeholder="email@mail.ru" density="compact"
          variant="outlined" hide-details @update:model-value="store.selectedOffer.email[0] = $event">
          </v-text-field>
        </div>
        <div class="offer-contact__input">
          <div>Адрес для корреспондеции</div>
          <v-text-field
          :model-value="store.selectedOffer.address" placeholder="Индекс, город, улица, дом, квартира"
          density="compact" variant="outlined" hide-details @update:model-value="store.selectedOffer.address = $event">
          </v-text-field>
        </div>
      </div>
        <div class="offer-contact__input">
          <div>Юридический адрес</div>
          <v-text-field
          :model-value="store.selectedOffer.address_legal" placeholder="Индекс, город, улица, дом, квартира"
          density="compact" variant="outlined" hide-details @update:model-value="store.selectedOffer.address_legal = $event">
          </v-text-field>
        </div>
    </div>
    <div class="offer-section__container">
      <div class="offer-section__header">Платёжная информация</div>
      <div class="offer-contact">
        <div class="offer-contact__input">
          <div>Расчётный счёт</div>
          <v-text-field
          :model-value="store.selectedOffer.payment_account" placeholder="Расчётный счёт" density="compact"
          variant="outlined" hide-details @update:model-value="store.selectedOffer.payment_account = $event"/>
        </div>
        <div class="offer-contact__input">
          <div>БИК банка</div>
          <v-text-field
          :model-value="store.selectedOffer.payment_bank_bic" placeholder="БИК банка" density="compact"
          variant="outlined" hide-details @update:model-value="store.selectedOffer.payment_bank_bic = $event">
        </v-text-field>
      </div>
      <div class="offer-contact__input">
        <div>Корреспондентский счёт</div>
        <v-text-field
        :model-value="store.selectedOffer.payment_bank_correspondent_account"
        placeholder="Корреспондентский счёт" density="compact" variant="outlined" hide-details
        @update:model-value="store.selectedOffer.payment_bank_correspondent_account = $event">
      </v-text-field>
    </div>
    <div class="offer-contact__input">
      <div>Наименование банка</div>
      <v-text-field
      :model-value="store.selectedOffer.payment_bank_name" placeholder="Наименование банка"
      density="compact" variant="outlined" hide-details
        @update:model-value="store.selectedOffer.payment_bank_name = $event">
      </v-text-field>
    </div>
      </div>
      </div>
    <div>
      <div class="offer-section__header">Дополнительно</div>
      <div class="mb-2">
        <div>С кем заключается договор</div>
        <v-radio-group v-model="store.selectedOffer.is_manager" inline>
          <v-radio
          label="Блогер"
          :value=false></v-radio>
          <v-radio
          label="Менеджер блогера"
          :value=true></v-radio>
        </v-radio-group>
      </div>
      <div class="mb-2">
        <div>Комментарий</div>
        <v-text-field
        :model-value="store.selectedOffer.comment" placeholder="Введите комментарий" density="compact"
        variant="outlined" hide-details @update:model-value="store.selectedOffer.comment = $event">
        </v-text-field>
      </div>
    </div>
      <div>
        <div>Документы</div>
        <div class="offer-image__container">
          <div v-for="image in images" :key="image.id" class="me-2 offer-image__item">
            <div v-if="!image.filename.includes('.pdf')">
              <v-img :src="'data:image/jpeg;base64,' + image.data" @click="openImage('data:image/jpeg;base64,' + image.data)"/>
            </div>
            <div v-else>
              <v-btn icon="mdi-magnify" size="small" style="position: absolute" @click="openImage('data:application/pdf;base64,'+ image.data)"></v-btn>
              <object type="application/pdf" :data="'data:application/pdf;base64,'+ image.data"> </object>
            </div>
          </div>
        </div>
      </div>
    <div class="offer-actions__container">
      <div class="offer-actions__buttons">
        <v-combobox
        v-model="store.selectedOffer.responsible_manager_name"
        label="Ответственный менеджер"
        :items="managers"
        item-title="name"
        hide-details
        density="compact"
        variant="outlined"
        class="mb-4"
        @update:model-value="setManager($event)"/>
        <div v-if="store.selectedOffer.status === 'New'">
          <v-btn :disabled="!store.selectedOffer.responsible_manager" class="me-2 offer-actions__button offer-actions__reject" @click="openDialog('declined')">
              Отклонить
          </v-btn>
          <v-btn class="me-2 offer-actions__button" color="primary" @click="openDialog('save')">
            Сохранить
          </v-btn>
          <v-btn  :disabled="!store.selectedOffer.responsible_manager" class="offer-actions__button offer-actions__accept" @click="openDialog('accept')">
            Создать контрагента
          </v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-if="dialogShown" :model-value="dialogShown" max-width="540px" persistent>
        <v-alert
          :model-value="store.alertShown"
          icon="$info"
          closable
          type="warning"
          :text="store.errorMessage"
        ></v-alert>
      <v-card class="offer-dialog__container">
        <div class="offer-dialog__message">
          {{ messageText }}
        </div>
        <v-container v-if="preloader" class="offer-dialog__preloader">
          <v-progress-circular indeterminate :size="70"></v-progress-circular>
        </v-container>
        <div v-else class="offer-dialog__actions">
          <v-btn :disabled="store.alertShown && status === 'New'" color="primary" class="me-4" @click="saveOffer"> {{ buttonText }} </v-btn>
          <v-btn @click="closeSaveDialog">Нет</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog :model-value="imagePreview" max-width="1200" persistent transition="dialog-top-transition">
      <div style="display: flex; justify-content: end">
      <v-btn
        icon="mdi-close"
        variant="text"
        style="align-self: flex-end;"
        @click="imagePreview = !imagePreview"/>
      </div>
      <v-card class="offer-dialog__container">
        <v-img v-if="!dialogImage.includes('pdf')" :src="dialogImage" width="700" class="mb-2"/>
        <object v-else  type="application/pdf" :data="dialogImage" width="1200" height="700" class="mb-2"> </object>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { offerStore } from '@/stores/offer';
import router from '@/plugins/router';
import { restApi } from '@/restApi/restMethods.vue';

definePage({
  meta: {
    parentSection: 'DMS'
  },
})

const store = offerStore();
const managers = ref([]);
const dialogShown = ref(false);
const imagePreview = ref(false);
const preloader = ref(false);
const messageText = ref('');
const buttonText = ref('');
const status = ref('');
const dialogImage = ref('');
const images = ref([]);

const saveOffer = async () => {
  preloader.value = !preloader.value
  await store.saveOffer(status.value)
  preloader.value = !preloader.value
  if (!store.alertShown) {
    if (status.value !== 'New') {
      router.push({ path: `/partners/offers` })
    }
    dialogShown.value = !dialogShown.value
  }
};
const setManager = (value: { responsible_manager: string, responsible_manager_name: string }) => {
  store.selectedOffer.responsible_manager = value.id_;
  store.selectedOffer.responsible_manager_name = value.name;
};
const openImage = (source: string) => {
  dialogImage.value = source;
  imagePreview.value = !imagePreview.value;
}
const openDialog = (action: string) => {
  if (action === 'declined') {
    messageText.value = 'Вы уверены что хотите отклонить заявку?'
    buttonText.value = 'Да, отклонить'
    status.value = 'Отклонена'
  } else if (action === 'accept') {
    messageText.value = 'Вы уверены что хотите создать контрагента?'
    buttonText.value = 'Да, создать контрагента'
    status.value = 'Принята'
  } else {
    messageText.value = 'Сохранить изменения?'
    buttonText.value = 'Да, сохранить'
    status.value = 'New'
  }
  dialogShown.value = !dialogShown.value
}

const closeSaveDialog = () => {
  dialogShown.value = !dialogShown.value;
  store.alertShown = false;
}

onMounted(async () => {
  await store.getOffer(router.currentRoute.value.params.id);
  await restApi.get('/one_c/division/').then(async (res: { data: any[]; }) => {
    const divisionId = res.data.find((el: { name: string; }) => el.name === "Отдел работы с блогерами").id_
    await restApi.get(`/one_c/user/division/${divisionId}/`).then((res: { data: never[]; }) => managers.value = res.data)
  });
  restApi.get(`/marketing/blogger_file/${store.selectedOffer.id_}/`).then((res: { data: any[]; }) => {
    res.data.forEach((el: { aws_id: any; }) => {
      restApi.get(`/aws/blogger_offer/${el.aws_id}/`).then((res: { data: { result: any; }; }) => images.value.push(res.data.result))
    });
  });
})

</script>

<style scoped lang="scss">
.offer {
  &-container {
    padding: 16px;
  }

  &-section {
    &__header {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 4px;
    }
    &__container {
      margin-bottom: 12px ;
    }
  }
  &-personal {
    display: flex;
    margin-bottom: 4px;

    &__input {
      max-width: 320px;
      width: 100%;
      margin-right: 8px;
    }
  }
  &-contact {
    display: flex;
    margin-bottom: 4px;
    &__input {
      max-width: 320px;
      width: 100%;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
        max-width: none;
      }
    }
  }

  &-passport {
    display: flex;
    margin-bottom: 4px;
    &__series {
      max-width: 152px;
      width: 100%;
      margin-right: 8px;
    }
    &__number {
      max-width: 160px;
      width: 100%;
      margin-right: 8px;
    }
    &__address {
      max-width: 648px;
      width: 100%;
      margin-right: 8px;
    }
    &__date {
      max-width: 320px;
      width: 100%;
      margin-right: 8px;
    }
    &__code {
      max-width: 150px;
      width: 100%;
      margin-right: 8px;
    }
  }
  &-actions {
    &__container {
      display: flex;
      justify-content: end;
      padding-right: 16px;
    }

    &__buttons {
      max-width: 430px;
      width: 100%;
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
      color: #fff;

      &:hover {
        opacity: 1;
      }
    }
    &__accept {
      background-color: #55a50b;
    }
    &__reject {
      background-color: #c91212;
    }
  }
  &-dialog {
    &__container {
      padding: 16px;
      display: flex;
      align-items: center;
    }
    &__message {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    &__preloader {
      display: flex;
      justify-content: center
    }
  }
  &-image {
    &__container {
      display: flex;
      width: 100%;
      height: 100%;
      flex-wrap: wrap;
    }
    &__item {
      max-width: 300px;
      width: 100%;
      max-height: 200px;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
