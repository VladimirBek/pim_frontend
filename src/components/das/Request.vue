<template>
  <div class="request-container">
    <h2 class="request-header">{{ store.getTitle }}</h2>
    <div style="display: flex; ">
      <h3 class="request-name">{{ store.selectedRequest.title }}</h3>
    </div>
    <div class="request">
      <!-- <div class="request-info">
      </div> -->
      <div class="request-info__container" style="margin-bottom: 8px;">
        <div class="request-info__block">
          <div class="request-info__title">Тип заявки</div>
          <div class="request-info__value">{{ store.selectedRequest.type }}</div>
        </div>
      </div>
      <div class="request-status" style="margin-bottom: 8px;">
        <div class="request-status__priority">Приоритет<v-icon :color="priorColor" icon="custom:flag"
            class="request-stsatus__icon"></v-icon></div>
        <div class="request-status__name" :class="statusColor">{{ store.selectedRequest.status }}</div>
      </div>
    </div>
    <div class="request-info">
      <div class="request-info__title">Департамент</div>
      <div class="request-info__value">{{ store.selectedRequest.initiator.department }}</div>
      <div class="request-info__title">Инициатор</div>
      <div class="request-info__value">{{ store.selectedRequest.initiator.fullname }}</div>
      <div v-if="isITRequest" class="request-info__title">Наименование</div>
      <div v-if="isITRequest" class="request-info__value">{{ store.selectedRequest.specific_data.name }}</div>
      <div v-if="isITRequest" class="request-info__title">Стоимость</div>
      <div v-if="isITRequest" class="request-info__value">{{ store.selectedRequest.specific_data.price / 100 }}</div>
      <div v-if="isITRequest" class="request-info__title">Количество</div>
      <div v-if="isITRequest" class="request-info__value">{{ store.selectedRequest.specific_data.quantity }}</div>
      <div v-if="store.selectedRequest.type === 'Закупка программного обеспечения'" class="request-info__title">Длительность</div>
      <div v-if="store.selectedRequest.type === 'Закупка программного обеспечения'" class="request-info__value">{{ store.selectedRequest.specific_data.duration }}</div>
      <div v-if="store.selectedRequest.type === 'Закупка программного обеспечения'" class="request-info__title">Ссылка на ПО</div>
      <div v-if="store.selectedRequest.type === 'Закупка программного обеспечения'" class="request-info__value">{{ store.selectedRequest.specific_data.source_link }}</div>
    </div>
    <div v-if="isPaymentRequest && store.selectedRequest.specific_data?.cardType" class="request-info__container">
      <div class="request-info__title">Карта</div>
      <div class="request-info__value">{{ getCard }}</div>
      <div class="request-info__container" style="margin-bottom: 8px;">
      </div>
    </div>
    <div v-if="isPaymentRequest" class="request-expense__container" style="margin-bottom: 12px;">
      <h3 class="chain-header">
        Расходы
      </h3>
      <div class="request-files__list">
        <div v-for="expense in store.selectedRequest.specific_data?.expenses" :key="expense"
          class="chain-item__container">
          <div class="chain-item__name request-expense__name chain-item__name--pause"
            style="white-space: nowrap;  overflow: hidden;">
            {{ expense.name }}</div>
          <div class="chain-item__name request-expense__price chain-item__name--pause"
            style="white-space: nowrap;  overflow: hidden;">
            {{ expense.price }}</div>
        </div>
        <div class="request-expense__total"> Общая сумма: {{ store.selectedRequest.specific_data?.totalSum }}</div>
      </div>
    </div>
    <!-- <div v-if="isITRequest">
      <div class="request-info">
      </div>
    </div> -->
    <!-- <div style="margin-bottom: 8px;">
      <div class="request-info">
        <div class="request-info__container">
        </div>
      </div>
    </div> -->
    <div style="display: flex; margin-bottom: 8px;">
      <!-- <div class="request-areas__container request-areas__description"> -->
      <!-- <div>Причина закупки</div>
        <div class="request-areas__item" style="min-height: 100px; max-height: 100px;">{{ store.selectedRequest.description }}</div>
      </div> -->
      <div v-if="store.selectedRequest.type === 'Закупка ИТ оборудования'"
        class="request-areas__container request-areas__description">
        <div>Технические характеристики</div>
        <div class="request-areas__item" style="min-height: 100px; max-height: 100px;">{{
          store.selectedRequest.specific_data.specs }}</div>
      </div>
    </div>
    <div class="request-members__container">
      <ApproveChain :is-detail="props.isDetail" />
      <div>
        <div class="chain-header">
          Наблюдатели:
        </div>
        <div style="max-height: 175px; height: 100%;">
          <div style="max-height: 175px; height: 100%;">
            <div class="request-observer__container" style="max-height: 175px; height: 100%;">
              <div class="request-observer__list" style="max-height: 175px; height: 100%;">
                <div v-if="store.selectedRequest.observers && store.selectedRequest.observers.length === 0"
                  class="chain-item__container">
                  В данной заявке нет наблюдателей
                </div>
                <div v-else>
                  <div v-for="observer in store.selectedRequest.observers" :key="observer.id"
                    class="request-observer__name request-status__name--approved">
                    {{ observer.observer_info.shortname }}
                  </div>
                </div>
                <div v-if="obsAvailable" class="chain-item__container">
                  <v-btn class="button-secondary" style="width: 100%;" @click="openDialog()">Добавить</v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="request-additional__container">
      <!-- <div class="request-files__container mr-2" style="width: 100%; max-width: none;">
        <span>Ссылки</span>
        <div class="request-files__list">
          <div v-if="store.selectedRequest.links?.length === 0">
            Ссылки отсутствуют
          </div>
          <a v-for="link in store.selectedRequest.links" :key="link" :href="link" class="request-files__item"
            style="width: 100%; display: inline-block; margin-right: 0;">
            {{ link }}
          </a>
        </div>
      </div> -->
    </div>
    <div class="request-areas">
      <div class="request-areas__container request-areas__description">
        <div v-if="isITRequest">Причина закупки</div>
        <div v-else>Описание</div>
        <div class="request-areas__item" :class="store.selectedRequest.status === 'Отозвано' || store.selectedRequest.status === 'В архиве' ? 'request-areas__item--short' : ''">{{
          store.selectedRequest.description }}</div>
        <!-- <div v-if="isDetail" class="request-actions__container" style="justify-content: start; margin-top: 6px;">
          <v-btn class="button-secondary request-actions__button" @click="router.push('/das/requests')">Назад</v-btn>
        </div> -->
        <div class="request-files__container">
          <span>Файлы</span>
          <div class="request-files__list">
            <v-file-input v-if="store.selectedRequest.status === 'Согласовано' && store.roles.includes('initiator')"
              :model-value="store.request.files" label="Приложите файл" multiple density="compact" variant="outlined"
              hide-details style="margin-bottom: 8px;" @update:model-value="uploadFiles($event)"></v-file-input>
            <div v-if="store.selectedRequest.files?.length === 0">
              Файлы отсутствуют
            </div>
            <div v-for="file in store.selectedRequest.files" :key="file.id"
              class="request-files__item request-files__item--load" @click="downloadFile(file.aws_id)">
              {{ file.file_name }}
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="!props.isDetail" class="request-areas__container">
        <div>Комментарии</div>
        <div class="request-areas__item">
          <div v-for="comment in store.comments">
            {{ comment.created_at_str }} {{ getTime(comment.created_at) }} {{ comment.user_profile.shortname }}: "{{
              comment.text }}"
          </div>
        </div>
      </div> -->
      <div style="display: flex; flex-direction: column;">
        <div style="margin-bottom: 16px;">
          <div>Добавить комментарий</div>
          <v-textarea v-if="store.selectedRequest.status !== 'Отозвано' && store.selectedRequest.status !== 'В архиве'" :model-value="store.comment.text" :rows="1"
            placeholder="Напишите комментарий" :append-inner-icon="'custom:send'" variant="outlined" hide-details
            style="margin-right: 0; width: 100%;" @update:model-value="store.comment.text = $event"
            @click:append-inner="store.sendComment()">
          </v-textarea>
          <div class="request-areas__item" style="min-height: 130px; max-height: 140px; margin-bottom: 4px">
            <div v-for="comment in store.comments" :key="comment.id_">
              {{ comment.created_at_str }} {{ comment.user_profile.shortname }} {{ comment.text }}
            </div>
          </div>
          <div>
            <div>История изменений</div>
            <div class="request-areas__item" style="min-height: 120px; max-height: 120px;">
              <div v-for="log in store.logs" :key="log.id_">
                {{ log.created_at_str }} {{ log.text }}
              </div>
            </div>
          </div>
        </div>
        <div class="request-actions__container">
          <v-menu transition="slide-y-transition">
            <template v-slot:activator="{ props }">
              <v-btn v-if="isDownloadAvailable" v-bind="props" :disabled="!downloadAvailable"
                class="button request-actions__button">Выгрузить</v-btn>
            </template>
            <v-list>
              <v-list-item v-for="org in orgs" :key="org" :value="org">
                <v-list-item-title @click="downloadDoc(org)">{{ org }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn v-if="isDetail" class="button-secondary requests-actions__btn" @click="router.push(`/das/requests/`)">
            Назад
          </v-btn>
          <!-- <v-btn class="button requests-actions__btn" @click="router.push('/das/request/new')">
            Создать новую заявку
          </v-btn> -->
          <v-btn
            v-if="(store.roles.includes('initiator') || isAssist) && isButtonAvailable && store.selectedRequest.status !== 'В архиве'"
            class="button request-actions__button" @click="openReason('recall')">Отозвать</v-btn>
          <v-btn
            v-if="store.roles.includes('initiator') && isButtonAvailable && store.selectedRequest.status !== 'В архиве' && !isPaymentRequest"
            class="button request-actions__button" @click="editRequest()">Редактировать</v-btn>
          <v-btn
            v-if="store.roles.includes('initiator') && isButtonAvailable && store.selectedRequest.status === 'На доработке'"
            class="button request-actions__button" @click="openReason('decline_rework')">Вернуть в работу</v-btn>
          <v-btn
            v-if="(store.roles.includes('approval_active') || store.roles.includes('approval_queue')) && isButtonAvailable"
            class="button request-actions__button" @click="openReason('decline')">Отклонить</v-btn>
          <v-btn v-if="store.roles.includes('approval_active') && isButtonAvailable"
            class="button request-actions__button" @click="openReason('rework')">На доработку</v-btn>
          <v-btn v-if="store.roles.includes('approval_active') && isButtonAvailable"
            class="button request-actions__button" @click="requestAction('approve')">Согласовать</v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-model="isShown" class="create-dialog">
      <v-card class="create-dialog__container">
        <h2>Выберите наблюдателя</h2>
        <div class="create-dialog__table">
          <div class="create-dialog__filter">
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                Департамент
              </div>
              <div>
                <v-combobox :items="store.departmentFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите департамент" hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'department')" />
              </div>
            </div>
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                Должность
              </div>
              <div>
                <v-combobox :items="store.jobFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите должность" hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'job')" />
              </div>
            </div>
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                ФИО
              </div>
              <div>
                <v-combobox :items="store.nameFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите ФИО" hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'name')" />
              </div>
            </div>
            <div style="color: #fff; margin-left: 4px;">
              <v-icon :icon="'custom:plus'"></v-icon>
            </div>
          </div>
          <div v-for="user in store.filtredUsers" :key="user.id_" class="create-dialog__raw">
            <div class="create-dialog__users">
              <div class="create-dialog__item">
                {{ user.department }}
              </div>
              <div class="create-dialog__item">
                {{ user.job_title }}
              </div>
              <div class="create-dialog__item">
                {{ user.fullname }}
              </div>
            </div>
            <div class="create-dialog__raw--icon">
              <div v-if="getIcon(user) === 'plus'">
                <v-icon :icon="'custom:plus'" @click="addMember(user, 'add')"></v-icon>
              </div>
              <div v-else>
                <v-icon :icon="'custom:check'" @click="addMember(user, 'delete')"></v-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="create-actions">
          <v-btn class="button-secondary create-actions__btn" @click="closeDialog()">Отмена</v-btn>
          <v-btn class="button create-actions__btn" @click="addObsever()">Применить</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="reasonDialog" :class="reason === 'recall' ? 'create-dialog--mini' : 'create-dialog'">
      <v-card class="create-dialog__container">
        <h2 class="mb-2">{{ reasonTitle }}</h2>
        <v-textarea v-if="reason !== 'recall'" :model-value="store.comment.text" :rows="2"
          placeholder="Напишите комментарий" variant="outlined" style="margin-right: 0; width: 100%;"
          @update:model-value="store.comment.text = $event">
        </v-textarea>
        <div class="create-actions">
          <v-btn class="button-secondary create-actions__btn" @click="reasonDialog = !reasonDialog">Отмена</v-btn>
          <v-btn v-if="reason !== 'recall'" class="button create-actions__btn"
            @click="requestAction(reason)">Применить</v-btn>
          <v-btn v-else class="button create-actions__btn" @click="requestAction(reason)">Отозвать</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import router from '@/plugins/router';
import { formApi, restApi } from '@/restApi/restMethods.vue';
import { dasStore } from '@/stores/das';

const store = dasStore();
const isShown = ref(false);
const reasonDialog = ref(false);
const observers = ref([]);
const reason = ref('decline');
const orgs = ref([
  'Интеграаал',
  'Интеграл Тек'
]);
const downloadAvailable = ref(true);
const warningMessage = ref('');
const extensionToMimeMap = new Map<string, string>([
  ["pdf", "application/pdf"],
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["gif", "image/gif"],
  ["webp", "image/webp"],
  ["svg", "image/svg+xml"],
  ["doc", "application/msword"],
  ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ["xls", "application/vnd.ms-excel"],
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["ppt", "application/vnd.ms-powerpoint"],
  ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ["txt", "text/plain"],
  ["csv", "text/csv"],
  ["zip", "application/zip"],
  ["json", "application/json"],
  ["mp4", "video/mp4"],
  ["mp3", "audio/mpeg"],
]);

const props = defineProps({
  isDetail: {
    type: Boolean,
    required: false,
    default: () => false
  },
  isEdit: {
    type: Boolean,
    required: false,
    default: () => false
  },
});

const getCard = computed(() => {
  return store.selectedRequest.specific_data.cardType === 'corporate' ? 'Корпоративная' : 'Зарплатная'
})

const statusColor = computed(() => {
  let className = ""
  if (store.selectedRequest.status === 'Согласовано') {
    className = "request-status__name--approved"
  } else if (store.selectedRequest.status === 'Отклонено') {
    className = "request-status__name--rejected"
  } else if (store.selectedRequest.status === 'На доработке') {
    className = "request-status__name--rework"
  }
  return className
});

const reasonTitle = computed(() => {
  if (reason.value === 'decline') {
    return 'Причина отклонения заявки'
  } else if (reason.value === 'rework') {
    return 'Причина отправки на доработку'
  } else if (reason.value === 'recall') {
    return 'Вы точно хотите отозвать заявку?'
  } else {
    return 'Причина возврата заявки в работу'
  }
})

const isAssist = computed(() => {
  return localStorage.getItem('id') === "0637759d-2a4e-4127-8683-08e88fda7217" && store.selectedRequest.initiator.id_ === '98cf1909-38c7-422d-98c7-9327499ea694'
})

const isButtonAvailable = computed(() => {
  return store.selectedRequest.status !== 'Отозвано' && store.selectedRequest.status !== 'Отклонено' && store.selectedRequest.status !== 'Согласовано'
})

const isDownloadAvailable = computed(() => {
  return store.selectedRequest.status === 'В архиве' || store.selectedRequest.status === 'Согласовано'
})

const priorColor = computed(() => {
  if (store.selectedRequest.priority_type === 'Высокий') {
    return '#D32F2F'
  } else if (store.selectedRequest.priority_type === 'Низкий') {
    return '#2E7D32'
  } else if (store.selectedRequest.priority_type === 'Средний') {
    return '#FBC02D'
  }
});

const obsAvailable = computed(() => {
  return props.isDetail && store.selectedRequest.status !== 'Отклонено' && store.selectedRequest.status !== 'Согласовано' && store.selectedRequest.status !== 'Отозвано'
})

const getTime = (createdDate) => {
  const date = new Date(createdDate);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) minutes = '0' + minutes;
  return `${hours}:${minutes}`
}

const base64ToBlob = (base64Data: string, mimeType: string) => {
  // const binaryString = window.atob(base64Data)
  // const len = binaryString.length
  // const bytes = new Uint8Array(len)
  // for (let i = 0; i < len; i++) {
  //   bytes[i] = binaryString.charCodeAt(i)
  // }
  const cleanedBase64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
  const byteCharacters = atob(cleanedBase64);
  const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

const isPaymentRequest = computed(() => {
  return store.selectedRequest.type === 'Компенсация ДС' || store.selectedRequest.type === 'Компенсация командировочных расходов' || store.selectedRequest.type === 'Выдача подотчётных ДС'
});

const isITRequest = computed(() => {
  return store.selectedRequest.type === 'Закупка программного обеспечения' || store.selectedRequest.type === 'Закупка ИТ оборудования'
});


const uploadFiles = (files) => {
  files.forEach(async (el) => {
    const form = new FormData()
    form.append('file_object', el);
    await formApi.post('/aws/blogger_offer/', form).then(res => {
      const file = {
        aws_id: res.data.key,
        file_name: el.name,
        request_id: store.selectedRequest.id_
      }
      store.selectedRequest.files.push(file)
      store.editFiles(file);
    })
  });
}

const requestAction = async (action: string) => {
  await store.requestAction(action).then(() => {
    store.getRequest(store.selectedRequest.id_);
    // store.getLogs()
    // store.getComments();
    reasonDialog.value = false;
  })
}

const downloadDoc = async (value: string) => {
  const report = {
    request_id: store.selectedRequest.id_,
    legal_entity: value
  }
  downloadAvailable.value = false
  await restApi.post('/das/requests/create_report/', report).then((res: { data: { file_base64: string; }; }) => {
    try {
      const blob = base64ToBlob(res.data.file_base64, 'application/octet-stream')
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = res.data.file_name
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
      downloadAvailable.value = true
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
    }
  }).catch(
    downloadAvailable.value = true
  )
}

const downloadFile = async (id) => {
  await restApi.get(`/aws/blogger_offer/${id}`).then((res: { data: { result: { data: string; }; }; }) => {
    try {
      const mimeType = extensionToMimeMap.get(res.data.result.file_type)
      const blob = base64ToBlob(res.data.result.data, mimeType)

      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      // const link = document.createElement('a')
      // link.href = blobUrl
      // link.download = res.data.result.filename
      // link.style.display = 'none'
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
      // URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
    }
  })
}

const closeDialog = () => {
  observers.value = []
  isShown.value = !isShown.value
}

const addObsever = async () => {
  const members = observers.value.map(obs => ({
    user_id: obs.id_,
    role: "Наблюдатель"
  }));
  const data = {
    request_id: store.selectedRequest.id_,
    members: members
  };
  await store.addRequestMember(data).then(isShown.value = !isShown.value)
}

const editRequest = () => {
  router.push(`/das/request/edit/${store.selectedRequest.number_str}`)
};

const openDialog = () => {
  store.filtredUsers = store.users;
  const chainedIds = new Set(
    store.selectedRequest.approval_chain.flatMap(chain =>
      chain.approvals.map(app => app.user.id_)
    ));
  store.filtredUsers = store.filtredUsers.filter(user => user.id_ !== store.selectedRequest.initiator.id_)
  const observerIds = new Set(store.selectedRequest.observers.map(obs => obs.observer_info.id_));
  store.filtredUsers = store.filtredUsers.filter(user => !chainedIds.has(user.id_))
  store.filtredUsers = store.filtredUsers.filter(user => !observerIds.has(user.id_))
  observers.value.forEach(observer => {
    store.filtredUsers = store.filtredUsers.filter(user => {
      return observer.id_ !== user.id_
    })
  });
  isShown.value = !isShown.value;
}

const getIcon = (user) => {
  const userIncludes = observers.value.some(el => el.id_ === user.id_)
  return userIncludes ? 'check' : 'plus'
}

const addMember = (user, action) => {
  if (action === 'add') {
    observers.value.push(user);
  } else {
    observers.value = observers.value.filter(el => el.id_ !== user.id_);
  }
}

const openReason = (action: string) => {
  reason.value = action;
  reasonDialog.value = !reasonDialog.value
}

const showAlert = (action: string) => {
  warningMessage.value = action === 'recall' ? "Вы уверены что хотите отозвать заявку?" : "Вы уверены что хотите отклонить заявку?";
  reasonDialog.value = !reasonDialog.value
}

onMounted(async () => {
  if (store.selectedRequest.number_str) {
    // await store.getRequest(store.selectedRequest.number_str)
    // await store.getLogs()
  }
  await store.getUsers()
})

</script>
<style lang="scss">
.request {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 4px;

  &-members {
    &__container {
      display: flex;
      justify-content: space-between;
    }
  }

  &-header {
    margin-bottom: 4px;
    font-size: 18px;
  }

  &-name {
    margin-bottom: 4px;
    font-family: 'Involve';
    font-size: 18px;
  }

  &-container {
    max-width: 1340px;
  }

  &-info {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 2fr 1fr 2fr;
    grid-template-rows: repeat(1fr);
    grid-column-gap: 8px;
    grid-row-gap: 8px;
    margin-bottom: 8px;

    &__container {
      font-size: 18px;
      display: flex;
    }

    &__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 12px;
      min-width: 120px;
    }

    &__title {
      margin-right: 8px;
      align-self: center;
    }

    &__value {
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      padding: 6px;
      min-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-status {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-family: 'Involve-bold';
    text-align: center;
    font-size: 18px;

    &__priority {
      margin-right: 8px;
    }

    &__name {
      border-radius: 4px;
      padding: 6px;
      background-color: #808080;

      &--approved {
        background-color: #2E7D32;
      }

      &--rework {
        background-color: #FBC02D;
      }

      &--rejected {
        background-color: #D32F2F;
      }
    }
  }

  &-additional {
    &__container {
      display: flex;
      align-items: top;
      margin-bottom: 8px;
    }

    &__block {
      display: flex;
    }
  }

  &-observer {
    &__container {
      min-width: 240px;
      width: 100%;
      align-items: center;
    }

    &__header {
      font-family: 'Involve';
      font-size: 16px;
    }

    &__list {
      max-width: 240px;
      padding: 6px;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      font-size: 14px;
      max-height: 120px;
      min-height: 120px;
      overflow-y: auto;
    }

    &__name {
      padding: 6px;
      border-radius: 4px;
      margin-bottom: 2px;
    }
  }

  &-files {
    &__container {
      min-width: 220px;
    }

    &__list {
      font-size: 14px;
      padding: 6px;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      height: 120px;
      overflow-y: auto;
    }

    &__item {
      padding: 6px;
      border: 1px solid #b6b5b5;
      border-radius: 4px;
      margin-bottom: 2px;
      max-width: 408px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 4px;

      &:hover {
        cursor: pointer;
      }

      &--load {
        &:hover {
          background-color: #808080;
        }
      }
    }
  }

  &-actions {
    &__button {
      margin-right: 8px;
      max-width: 150px;
      width: 100%;

      &:last-child {
        margin-right: 0;
      }
    }

    &__container {
      width: 100%;
      display: flex;
      justify-content: end;
    }
  }

  &-areas {
    display: flex;
    width: 100%;
    min-height: 140px;
    margin-bottom: 8px;

    &__description {
      white-space: pre-line;
      margin-right: 16px;
    }

    &__container {
      height: 100%;
    }

    &__item {
      font-size: 14px;
      word-break: break-all;
      border: 1px solid #b6b5b5;
      padding: 8px;
      border-radius: 6px;
      min-width: 662px;
      margin-bottom: 4px;
      width: 100%;
      min-height: 196px;
      height: 100%;
      max-height: 196px;
      overflow-y: auto;

      &--short {
        max-height: 140px;
        min-height: 140px;
      }
    }
  }
}
</style>
