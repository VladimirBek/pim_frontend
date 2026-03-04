<template>
  <v-container fluid>
    <v-alert :model-value="!store.selectedPartner.blogger_offer_id" icon="$info" closable type="warning"
      text="Для создания приложения для данного контрагента необходимо завести заявку через телеграм бота"></v-alert>
    <v-alert :model-value="store.attachmentCreated" icon="$info" closable type="success"
      text="Приложение ожидает отправки, перед отправкой не забудьте проверить поля"></v-alert>
    <div class="partner-header__container">
      <h1>Детали контрагента</h1>
      <div>
        <div class="partner-header__manager">
          Ответственный менеджер
        </div>
        {{ store.selectedPartner.manager_name }}
      </div>
    </div>
    <v-card class="information-container">
      <div class="information-section">
        <div>Общая информация</div>
        <div class="information-section__header">Личные данные</div>
        <div style="display: flex; flex-direction: column;">
          <div class="information-section__container">
            <div class="information-field">
              <div class="information-field__header">Фамилия</div>
              {{ store.selectedPartner.f }}
            </div>
            <div class="information-field">
              <div class="information-field__header">Имя</div>
              {{ store.selectedPartner.i }}
            </div>
            <div class="information-field">
              <div class="information-field__header">Отчество</div>
              {{ store.selectedPartner.o }}
            </div>
          </div>
          <div class="information-section__container">
            <div class="information-field">
              <div class="information-field__header">Серия паспорта</div>
              {{ store.selectedPartner.blogger_offer?.passport_series }}
            </div>
            <div class="information-field">
              <div class="information-field__header">Номер паспорта</div>
              {{ store.selectedPartner.blogger_offer?.passport_number }}
            </div>
            <div class="information-field">
              <div class="information-field__header">Кем выдан</div>
              {{ store.selectedPartner.blogger_offer?.passport_issued }}
            </div>
            <div class="information-field">
              <div class="information-field__header">Дата выдачи</div>
              {{ store.selectedPartner.blogger_offer?.passport_date }}
            </div>
            <div class="information-field">
              <div class="information-field__header">Код подразделения</div>
              {{ store.selectedPartner.blogger_offer?.passport_code }}
            </div>
          </div>
        </div>
      </div>
      <div class="information-section">
        <div class="information-section__header">Юридическая информация</div>
        <div class="information-section__container">
          <div class="information-field">
            <div class="information-field__header">Организационно-правовая форма</div>
            {{ store.selectedPartner.blogger_offer?.legal_form }}
          </div>
          <div class="information-field">
            <div class="information-field__header">НДС</div>
            {{ store.selectedPartner.blogger_offer?.taxation_type }}
          </div>
          <div class="information-field">
            <div class="information-field__header">ИНН</div>
            {{ store.selectedPartner.inn }}
          </div>
          <div v-if="store.selectedPartner.ogrnip || store.selectedPartner.blogger_offer?.legal_form === 'ИП'"
            class="information-field">
            <div class="information-field__header">ОГРНИП</div>
            {{ store.selectedPartner.ogrnip }}
          </div>
          <div class="information-field">
            <div class="information-field__header">Юридический адрес</div>
            {{ store.selectedPartner.blogger_offer?.address_legal }}
          </div>
        </div>
      </div>
      <div class="information-section">
        <div class="information-section__header">Контактная информация</div>
        <div class="information-section__container">
          <div class="information-field">
            <div class="information-field__header">Ссылка на рекламную площадку</div>
            {{ store.selectedPartner.blogger_offer?.link_advertising_platform }}
          </div>
          <div v-if="store.selectedPartner.emails" class="information-field">
            <div class="information-field__header">Электронная почта</div>
            {{ store.selectedPartner.emails[0] }}
          </div>
          <div v-if="store.selectedPartner.phones" class="information-field">
            <div class="information-field__header">Телефон</div>
            {{ store.selectedPartner.phones[0] }}
          </div>
          <div class="information-field">
            <div class="information-field__header">Адрес для корреспондеции</div>
            {{ store.selectedPartner.blogger_offer?.address }}
          </div>
        </div>
      </div>
      <div class="information-section">
        <div class="information-section__header">Платёжная информация</div>
        <div class="information-section__container">
          <div class="information-field">
            <div class="information-field__header">Расчётный счёт</div>
            {{ store.selectedPartner.blogger_offer?.payment_account }}
          </div>
          <div class="information-field">
            <div class="information-field__header">БИК банка</div>
            {{ store.selectedPartner.blogger_offer?.payment_bank_bic }}
          </div>
          <div class="information-field">
            <div class="information-field__header">Корреспондентский счёт</div>
            {{ store.selectedPartner.blogger_offer?.payment_bank_correspondent_account }}
          </div>
          <div class="information-field">
            <div class="information-field__header">Наименование банка</div>
            {{ store.selectedPartner.blogger_offer?.payment_bank_name }}
          </div>
        </div>
      </div>
    </v-card>
    <v-card class="information-container">
      <div class="partner-section__header">Документооборот</div>
      <div class="information-section">
        <div>
          <div class="document-section__header">Создание и отправка документов</div>
          <v-btn :variant="'flat'" :disabled="!store.selectedPartner.blogger_offer_id" color="primary"
            class="document-section__button" @click="openDocDialog('application', 'docs')">Приложение</v-btn>
          <v-btn :variant="'flat'" :disabled="!store.selectedPartner.blogger_offer_id" color="primary"
            class="document-section__button" @click="openDocDialog('act', 'docs')">Акт</v-btn>
        </div>
      </div>
      <div class="information-section">
        <div v-if="store.receivedFiles && store.receivedFiles.length > 0">
          <div class="document-section__header">Полученные документы</div>
          <div class="partner-file__container">
            <div v-for="file in store.receivedFiles" :key="file.id" class="me-2 partner-file__item">
              <div v-if="!file.filename.includes('.pdf')">
                <v-img :src="'data:image/jpeg;base64,' + file.code"
                  @click="openFile('data:image/jpeg;base64,' + file.code, file)" />
              </div>
              <div v-else>
                <v-btn icon="mdi-magnify" size="small" style="position: absolute"
                  @click="openFile('data:application/pdf;base64,' + file.code, file)"></v-btn>
                <object type="application/pdf" :data="'data:application/pdf;base64,' + file.code"> </object>
              </div>
            </div>
          </div>
        </div>
        <div v-if="store.signedFiles && store.signedFiles.length > 0">
          <div class="document-section__header">Принятые документы</div>
          <div class="partner-file__container">
            <div v-for="file in store.signedFiles" :key="file.id" class="me-2 partner-file__item">
              <div v-if="!file.filename.includes('.pdf')">
                <v-img :src="'data:image/jpeg;base64,' + file.code"
                  @click="openFile('data:image/jpeg;base64,' + file.code, file)" />
              </div>
              <div v-else>
                <v-btn icon="mdi-magnify" size="small" style="position: absolute"
                  @click="openFile('data:application/pdf;base64,' + file.code, file)"></v-btn>
                <object type="application/pdf" :data="'data:application/pdf;base64,' + file.code"> </object>
              </div>
            </div>
          </div>
        </div>
        <div v-if="store.sendedFiles && store.sendedFiles.length > 0">
          <div class="document-section__header">Отправленные документы</div>
          <div class="partner-file__container">
            <div v-for="file in store.sendedFiles" :key="file.id" class="me-2 partner-file__item">
              <div v-if="!file.filename.includes('.pdf')">
                <v-img :src="'data:image/jpeg;base64,' + file.code"
                  @click="openFile('data:image/jpeg;base64,' + file.code, file)" />
              </div>
              <div v-else>
                <v-btn icon="mdi-magnify" size="small" style="position: absolute"
                  @click="openFile('data:application/pdf;base64,' + file.code, file)"></v-btn>
                <object type="application/pdf" :data="'data:application/pdf;base64,' + file.code"> </object>
              </div>
            </div>
          </div>
        </div>
        <div v-if="store.docFiles && store.docFiles.length > 0">
          <div class="document-section__header">Общие документы</div>
          <div class="partner-file__container">
            <div v-for="file in store.docFiles" :key="file.id" class="me-2 partner-file__item">
              <div v-if="!file.filename.includes('.pdf')">
                <v-img :src="'data:image/jpeg;base64,' + file.code"
                  @click="openFile('data:image/jpeg;base64,' + file.code, file)" />
              </div>
              <div v-else>
                <v-btn icon="mdi-magnify" size="small" style="position: absolute"
                  @click="openFile('data:application/pdf;base64,' + file.code, file)"></v-btn>
                <object type="application/pdf" :data="'data:application/pdf;base64,' + file.code"> </object>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <DocumentDialog :is-shown="isDocDialog" :type="docDialogType" :role="role" @close-dialog="closeDocDialog" />
    <v-dialog :model-value="filePreview" max-width="1200px" persistent transition="dialog-top-transition">
      <div style="display: flex; justify-content: end">
        <v-btn icon="mdi-close" variant="text" style="align-self: flex-end;" @click="filePreview = !filePreview" />
      </div>
      <v-card class="partner-dialog__container">
        <v-img v-if="!dialogFile.includes('pdf')" :src="dialogFile" class="partner-file__preview" />
        <div v-else>
          <object type="application/pdf" :data="dialogFile" width="1200" height="700" class="mb-2"> </object>
        </div>
        <div class="partner-dialog__actions">
          <v-select v-model="store.openedFile.document_type" :items="docTypes" label="Тип документа" variant="outlined"
            width=200 hide-details class="partner-dialog__select"></v-select>
          <v-btn color="red" class="document-section__button" @click="updateFile('Отменен')">Отклонить</v-btn>
          <v-btn color="primary" class="document-section__button" @click="updateFile('Подписан')">Принять</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { partnerStore } from '@/stores/partner';
import router from '@/plugins/router'
import DocumentDialog from '@/components/partner/DocumentDialog.vue'

definePage({
  meta: {
    parentSection: 'DMS'
  },
})

const store = partnerStore();
const isDocDialog = ref(false);
const docDialogType = ref("application");
const role = ref("doc");
const filePreview = ref(false);
const dialogFile = ref('');
const docTypes = ref([
  'Паспорт',
  'ИНН',
  'ОГРН',
  'Приложение',
  'Счёт',
  'Акт',
])

onMounted(async () => {
  await store.getPartner(router.currentRoute.value.params.id);
})

const openDocDialog = (type: string, role: string) => {
  store.openDocDialog();
  isDocDialog.value = !isDocDialog.value;
  docDialogType.value = type;
  if (type === 'act') {
    store.getCreatedApplications();
  }
}

const closeDocDialog = () => {
  isDocDialog.value = !isDocDialog.value;
}

const openFile = (value, file: object) => {
  dialogFile.value = value;
  store.openedFile.id = file.id;
  store.openedFile.document_type = file.document_type;
  store.openedFile.blogger_id = router.currentRoute.value.params.id;
  filePreview.value = !filePreview.value;
}

const updateFile = (status: string) => {
  filePreview.value = !filePreview.value
  store.updateFile(status)
}
</script>

<style scoped lang="scss">
.partner {
  &-container {
    padding: 16px;
  }

  &-section {
    &__header {
      font-size: 20px;
      font-weight: bold;
    }
  }

  &-header {
    &__container {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      align-items: center;
    }

    &__manager {
      font-weight: bold;
      font-size: 14px;
    }
  }

  &-file {
    &__container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%
    }

    &__item {
      max-width: 300px;
      width: 100%;
      max-height: 200px;
      height: 100%;
      cursor: pointer;
    }

    &__preview {
      margin-bottom: 12px;
      max-width: 700px;
      width: 100%;
    }
  }

  &-dialog {
    &__container {
      padding: 12px;
      display: flex;
      align-items: center;
    }

    &__message {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    &__select {
      max-width: 200px;
      width: 100%;
      margin-right: 8px;
    }

    &__actions {
      display: flex;
      justify-content: end;
      width: 100%;
    }
  }
}

.information {
  &-container {
    padding: 16px;
    border-radius: 24px;
    margin-bottom: 24px;
  }

  &-section {
    margin-bottom: 12px;
    font-size: 20px;
    font-weight: bold;

    &__header {
      font-size: 18px;
    }

    &__container {
      display: flex;
    }
  }

  &-field {
    margin-right: 8px;
    font-size: 16px;
    font-weight: 100;

    &__header {
      font-size: 14px;
      font-weight: bold;
      color: rgba(0, 26, 52, .6);
    }
  }
}

.document {
  &-section {
    &__header {
      font-size: 18px;
      margin-bottom: 4px
    }


    &__button {
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;
      color: #fff;
      margin-right: 8px;
    }
  }
}
</style>
