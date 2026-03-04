<template>
  <div class="request-container">
    <v-form ref="form" @submit.prevent="updateRequest">
      <h2 class="request-header">Редактирование заявки {{ store.request.number }}</h2>
      <div class="request">
        <div class="request-create__container">
          <div class="request-create__block">
            <div class="create-input__container">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Название заявки</h3>
              <v-text-field :model-value="store.request.title" :rules="textRules" required variant="outlined"
                placeholder="Введите название заявки" density="compact" class="create-input__field"
                @update:model-value="store.request.title = $event"></v-text-field>
            </div>
            <div class="create-input__container">
              <h3 class="request-create__title">Тип заявки</h3>
              <v-select :model-value="store.request.type" variant="outlined" :items="requestTypes" label="Выберите тип"
                density="compact" hide-details class="create-input__field"
                @update:model-value="setType($event)"></v-select>
            </div>
          </div>
          <div class="request-create__block">
            <div class="create-input__container">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Согласовать до</h3>
              <v-date-input v-model="store.request.deadline" :rules="dateRules" required prepend-icon=""
                prepend-inner-icon="$calendar" label="Выберите дату" placeholder="дд.мм.гггг" density="compact"
                variant="outlined" class="create-input__field"
                @update:model-value="store.request.deadline = new Date($event)"></v-date-input>
            </div>
            <div class="create-input__container">
              <h3 class="request-create__title">Приоритет</h3>
              <v-select :model-value="store.request.priority_type" variant="outlined"
                :items="['Низкий', 'Средний', 'Высокий']" label="Выберите приоритет" density="compact" hide-details
                class="create-input__field" @update:model-value="store.request.priority_type = $event"></v-select>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isITRequest">
        <div class="request-create__container">
          <div class="request-create__block">
            <div class="create-input__container" style="margin-bottom: 0;">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Наименование</h3>
              <v-text-field :model-value="store.request.specific_data.name" variant="outlined"
                placeholder="Введите название" :rules="textRules" required density="compact" class="create-input__field"
                @update:model-value="store.request.specific_data.name = $event"></v-text-field>
            </div>
            <div v-if="store.request.type === 'Закупка программного обеспечения'" class="create-input__container">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Срок действия</h3>
              <v-select :model-value="store.request.specific_data.duration" :items="periods" variant="outlined"
                placeholder="Выберите срок" :rules="textRules" required density="compact" class="create-input__field"
                @update:model-value="store.request.specific_data.duration = $event"></v-select>
            </div>
          </div>
          <div class="request-create__block">
            <div class="create-input__container" style="margin-bottom: 0;">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Стоимость</h3>
              <v-text-field :model-value="shownPrice" variant="outlined" placeholder="Введите стоимость"
                :rules="textRules" required density="compact" class="create-input__field"
                @update:model-value="setPrice($event)"></v-text-field>
            </div>
            <div v-if="store.request.type === 'Закупка программного обеспечения'" class="create-input__container">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Ссылка на ПО</h3>
              <v-text-field :model-value="store.request.specific_data.source_link" variant="outlined"
                placeholder="Введите ссылку" density="compact" class="create-input__field"
                @update:model-value="store.request.specific_data.source_link = $event"></v-text-field>
            </div>
          </div>
          <div class="request-create__block">
            <div class="create-input__container" style="margin-bottom: 0;">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Количество</h3>
              <v-text-field :model-value="store.request.specific_data.quantity" variant="outlined"
                placeholder="Введите количество" :rules="textRules" required density="compact"
                class="create-input__field"
                @update:model-value="store.request.specific_data.quantity = $event"></v-text-field>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; justify-content: space-between;">
          <div style="width: 100%;">
            <h3>Причина закупки</h3>
            <v-textarea :model-value="store.request.description" variant="outlined"
              placeholder="Введите причину закупки" :rules="textRules" required density="compact" row-height="40"
              rows="3" @update:model-value="store.request.description = $event"></v-textarea>
          </div>
          <div v-if="store.request.type === 'Закупка ИТ оборудования'" style="width: 100%;">
            <h3>Характеристики</h3>
            <v-textarea :model-value="store.request.specific_data.specs" variant="outlined"
              placeholder="Введите тех. характеристики" density="compact" row-height="40" rows="3"
              @update:model-value="store.request.specific_data.specs = $event"></v-textarea>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 12px;">
        <div v-if="!isITRequest">
          <h3>Описание</h3>
          <v-textarea :model-value="store.request.description" :rules="textRules" required label="Введите описание"
            auto-grow row-height="40" rows="8" variant="outlined"
            @update:model-value="store.request.description = $event"></v-textarea>
        </div>
        <div style="display: flex; width: 100%;">
          <div style="width: 100%; margin-right: 16px;">
            <h3>Цепочка согласования</h3>
            <div class="create-chain__container">
              <div v-for="chain in chainList" :key="chain.id" class="chain-list">
                <div>Этап {{ chain.stage_order }}</div>
                <div class="chain-step__container"
                  style="display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div v-for="approval in chain.approvals" :key="approval.id" class="chain-item__container">
                      <div class="chain-item__name chain-item__name--pause">{{ approval.shortname }}</div>
                      <div style="cursor: pointer;" @click="deleteApproval(chain.stage_order, approval.id_)">
                        <v-icon :icon="'custom:close-box'" style="color: #D32F2F;"></v-icon>
                      </div>
                    </div>
                    <div class="chain-item__container">
                      <v-btn class="button-secondary" style="width: 100%;"
                        @click="openDialog('approvals', chain.stage_order)">Добавить</v-btn>
                    </div>
                  </div>
                  <div v-if="chain.stage_order !== 1" class="create-chain__icon"
                    @click="deleteChain(chain.stage_order)">
                    <v-icon :icon="'custom:trash'"></v-icon>
                  </div>
                </div>
              </div>
              <div v-if="chainList.length < 3" @click="addStep">
                <v-icon :icon="'custom:plus'" style="width: 55px;
                height: 55px;
                color: #2E7D32; cursor: pointer;"></v-icon>
              </div>
            </div>
          </div>
          <div class="request-additional__block">
            <div class="request-observer__container">
              <h3 class="request-observer__header">
                Наблюдатели
              </h3>
              <div class="chain-step__container" style="max-height: 175px; height: 100%;">
                <div v-for="observer in shownObservers" :key="observer.id" class="chain-item__container">
                  <div class="chain-item__name chain-item__name--pause">{{ observer.shortname }}</div>
                  <v-icon :icon="'custom:close-box'" style="color: #D32F2F; cursor: pointer;"
                    @click="deleteObserver(observer.id_)"></v-icon>
                </div>
                <div class="chain-item__container">
                  <v-btn class="button-secondary" style="width: 100%;" @click="openDialog('observers')">Добавить</v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="request-additional__container">
          <div class="request-files__container" style="width: 100%; max-width: 778px;">
            <div style="min-height: 31px;">Приложенные файлы</div>
            <div v-if="fileList" class="request-files__list" style="min-height: 174px;">
              <v-file-input :model-value="store.request.files" label="Приложите файл" multiple density="compact"
                variant="outlined" hide-details style="margin-bottom: 8px;"
                @update:model-value="uploadFiles($event)"></v-file-input>
              <div v-for="file in store.request.files" :key="file.id" style="display: flex; align-items: center;">
                <div class="request-files__item">
                  {{ file.file_name }}
                </div>
                <div @click="deleteFile(file)">
                  <v-icon :icon="'custom:trash'"></v-icon>
                </div>
              </div>
            </div>
          </div>
          <!-- <ApproveChain v-if="!props.isEdit" :is-edit="props.isEdit"/> -->
          <!-- <div class="request-files__container" style="width: 100%;">
            <h3 class="request-observer__header">
              Ссылки
            </h3>
            <div class="request-files__list">
              <div v-for="link in store.request.links" :key="link" class="chain-item__container">
                <div class="chain-item__name chain-item__name--pause" style="white-space: nowrap;  overflow: hidden;">{{
                  link }}</div>
                <v-icon :icon="'custom:close-box'" style="color: #D32F2F; cursor: pointer;"
                  @click="deleteLink(link)"></v-icon>
              </div>
              <div class="chain-item__container">
                <v-text-field v-model="linkValue" class="link" density="compact" variant="outlined" placeholder="Ссылка"
                  hide-details @update:model-value="linkValue = $event"></v-text-field>
                <v-icon :icon="'custom:plus-box'" style="color: #2E7D32; cursor: pointer;" @click="addLink()"></v-icon>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <div class="create-actions" style="">
        <v-btn class="button-secondary create-actions__button" @click="cancelCreate()">Отмена</v-btn>
        <v-btn class="button create-actions__button" @click="updateRequest('edit')">Сохранить</v-btn>
      </div>
    </v-form>
    <v-dialog v-model="isShown" class="create-dialog">
      <v-card class="create-dialog__container">
        <h2>Выберите {{ approvalDialog ? 'согласующего' : 'наблюдателя' }}</h2>
        <!-- <v-text-field prepend-inner-icon="mdi-magnify" variant="outlined" placeholder="Поиск"></v-text-field> -->
        <div class="create-dialog__table">
          <div class="create-dialog__filter">
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                Департамент
              </div>
              <div class="create-dialog__test">
                <v-combobox :items="store.departmentFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите департамент" hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'department')" />
              </div>
            </div>
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                Должность
              </div>
              <div class="create-dialog__test">
                <v-combobox :items="store.jobFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите должность" hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'job')" />
              </div>
            </div>
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                ФИО
              </div>
              <div class="create-dialog__test">
                <v-combobox :items="store.nameFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите ФИО" hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'name')" />
              </div>
            </div>
            <div style="color: #fff; margin-left: 4px;">
              <v-icon :icon="'custom:plus'"></v-icon>
            </div>
          </div>
          <div v-for="user in store.filtredUsers" :key="user.id_" class="create-dialog__raw"
            @click="addMember(user, 'add')">
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
          <v-btn class="button-secondary create-actions__btn" @click="isShown = !isShown">Отмена</v-btn>
          <v-btn class="button create-actions__btn" @click="createChain()">Применить</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog :model-value="isDialogAlert" width="720px">
      <v-card class="create-alert__dialog">
        <h2>
          У вас имеются не заполненные этапы согласования.
        </h2>
        <h3>
          Вы уверены что хотите отредактировать заявку? Пустые этапы согласования будут удалены.
        </h3>
        <div>
          <v-btn class="button" style="margin-right: 16px;" @click="editChain()">Да, создать</v-btn>
          <v-btn class="button-secondary" @click="isDialogAlert = !isDialogAlert">Отмена</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="store.alert" color="error" top>
      {{ store.message }}
    </v-snackbar>
  </div>
</template>
<script setup>

import { VDateInput } from 'vuetify/labs/VDateInput';
import router from '@/plugins/router';
import { dasStore } from '@/stores/das';
import { formApi } from '@/restApi/restMethods.vue';

const route = useRoute();
const store = dasStore();
const chainList = ref([
  {
    stage_order: 1,
    approvals: []
  }
])
const observers = ref([]);
const shownObservers = ref([]);
const approvals = ref([]);
const fileList = ref([]);
const isShown = ref(false);
const approvalDialog = ref(false);
const stage_order = ref(1);
const isDialogAlert = ref(false);
const requiredRule = (value) => !!value || "Обязательно для заполнения";
const textRules = [requiredRule];
const dateRules = [requiredRule];
const form = ref(null);
const linkValue = ref('');
const shownPrice = ref(null);
const requestTypes = ref([
  'Свободная',
  'Закупка программного обеспечения',
  'Закупка ИТ оборудования',
]);
const periods = ref([
  "Бессрочно",
  "1 месяц",
  "3 месяца",
  "6 месяцев",
  "1 год",
  "Более 1 года"
]);

const isEdit = computed(() => {
  return route.path.includes('edit')
})

const addStep = () => {
  let step = chainList.value.length;
  if (step < 4) {
    step++
    const item =
    {
      stage_order: step,
      approvals: [
      ]
    }
    chainList.value.push(item)
  }
};

const deleteFile = (file) => {
  store.request.files = store.request.files.filter(el => el.aws_id !== file.aws_id)
}

const isITRequest = computed(() => {
  return store.request.type === 'Закупка программного обеспечения' || store.request.type === 'Закупка ИТ оборудования'
});

const addLink = () => {
  if (linkValue.value) {
    store.request.links.push(linkValue.value);
    linkValue.value = ''
  }
}

const deleteLink = (value) => {
  if (value) {
    const index = store.request.links.findIndex(el => el === value);
    if (index !== -1) {
      store.request.links.splice(index, 1);
    }
  }
}

const setType = (value) => {
  store.request.type = value
}

const setPrice = (value) => {
  shownPrice.value = value.replace(/[^0-9.,]/g, '').replace(/\s+/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
  store.request.specific_data.price = value.replace(/[^0-9.,]/g, '').replace(/\s+/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
}

const cancelCreate = () => {
  store.request = {
    initiator_id: '',
    title: '',
    type: 'Свободная',
    priority_type: 'Низкий',
    description: '',
    deadline: '',
    approval_chain: [],
    files: [],
    observers: [],
  }
  router.push(`/das/request/${store.selectedRequest.number_str}`)
}

const deleteChain = (step) => {
  if (chainList.value.length >= step) {
    const index = step - 1
    chainList.value.splice(index, 1)
    chainList.value.forEach(el => {
      if (el.stage_order > step) {
        el.stage_order--
      }
    });
  }
};


const deleteApproval = (step, member) => {
  const chain = chainList.value.find((el) => el.stage_order === step);
  if (chain) {
    chain.approvals = chain.approvals.filter(el => el.id_ !== member)
  }
};
const deleteObserver = (member) => {
  observers.value = observers.value.filter(el => el.id_ !== member)
  store.request.observers = store.request.observers.filter(el => el !== member)
  shownObservers.value = shownObservers.value.filter(el => el.id_ !== member)
};

const uploadFiles = (files) => {
  files.forEach(async (el) => {
    const form = new FormData()
    form.append('file_object', el);
    await formApi.post('/aws/blogger_offer/', form).then(res => {
      const file = {
        aws_id: res.data.key,
        file_name: el.name,
      }
      store.request.files.push(file)
    })
  });
}

const openDialog = (section, order) => {
  store.filtredUsers = store.users;
  observers.value.forEach(observer => {
    store.filtredUsers = store.filtredUsers.filter(user => {
      return observer.id_ !== user.id_
    })
  });
  chainList.value.forEach(chain => {
    chain.approvals.forEach(approval => {
      store.filtredUsers = store.filtredUsers.filter(user => {
        return approval.id_ !== user.id_
      })
    })
  });
  section === 'observers' ? approvalDialog.value = false : approvalDialog.value = true;
  isShown.value = !isShown.value;
  stage_order.value = order
}

const editChain = async () => {
  chainList.value = chainList.value.filter(el => el.approvals.length > 0);
  chainList.value.forEach(el => {
    const index = chainList.value.indexOf(el)
    el.stage_order = index + 1
  })
  isDialogAlert.value = !isDialogAlert.value
  await store.updateRequest(chainList.value).catch(err => {
    chainList.value = [
      {
        stage_order: 1,
        approvals: []
      }]
  })
}

const updateRequest = async () => {
  const isValid = await form.value.validate()
  if (isValid) {
    if (chainList.value.some(el => el.approvals.length === 0)) {
      isDialogAlert.value = !isDialogAlert.value
    } else {
      if (isITRequest.value) {
        store.request.specific_data.price = store.request.specific_data.price * 100
      }
      await store.updateRequest(chainList.value)
    }
  }
}

const addMember = (user, action) => {
  if (action === 'add') {
    approvalDialog.value ? approvals.value.push(user) : observers.value.push(user);
  } else {
    approvalDialog.value ? approvals.value = approvals.value.filter(el => el.id_ !== user.id_) : observers.value = observers.value.filter(el => el.id_ !== user.id_);
  }
}


const createChain = () => {
  if (approvalDialog.value) {
    chainList.value.find((el) => el.stage_order === stage_order.value).approvals = chainList.value.find((el) => el.stage_order === stage_order.value).approvals.concat(approvals.value);
    approvals.value = []
  } else {
    shownObservers.value = [...observers.value];
    store.request.observers = observers.value.map(el => el.id_)
  }
  isShown.value = !isShown.value
};

const getIcon = (user) => {
  const userIncludes = approvalDialog.value ? approvals.value.some(el => el.id_ === user.id_) : observers.value.some(el => el.id_ === user.id_)
  return userIncludes ? 'check' : 'plus'
}

onMounted(async () => {
  await store.getRequest();
  store.setRequest();
  chainList.value = store.selectedRequest.approval_chain.map(stage => ({
    stage_order: stage.stage_order,
    approvals: stage.approvals.map(approval => approval.user)
  }))
  observers.value = store.selectedRequest.observers.map(el => el = el.observer_info);
  shownObservers.value = [...observers.value];
  store.getUsers();
  if (store.request.specific_data.price) {
    shownPrice.value = store.request.specific_data.price/100
  }
})

</script>
<style lang="scss">
.create {
  &-alert {
    &__dialog {
      display: flex;
      justify-content: space-between;
      text-align: center;
      padding: 16px;
      min-height: 184px;

    }
  }

  &-dialog {
    max-width: 1320px;
    height: auto;

    &__container {
      padding: 24px;
      border-radius: 6px;
    }

    &__input {
      max-width: 420px;
    }

    &__filter {
      width: 100%;
      display: flex;
    }

    &__item {
      width: 100%;
      border-right: 2px solid #535353;
      padding: 4px;
      padding-left: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      :last-of-type {
        border-right: none;
      }
    }

    &__field {
      width: 100%;
    }

    &__title {
      font-size: 18px;
      margin-bottom: 2px;
    }

    &__users {
      width: 100%;
      margin-right: 4px;
      display: flex;
      border-radius: 4px;
      border: 1px solid #b6b5b5;
      padding: 4px 0;
      font-size: 14px;
      align-items: center;

      :hover {
        background-color: #b6b5b5;
      }

      :last-child {
        border-right: none;
      }
    }

    &__table {
      margin-bottom: 16px;
    }

    &__raw {
      display: flex;
      align-items: center;

      &:hover {
        cursor: pointer;
      }

      &--icon {
        border-radius: 50%;
        background-color: #b6b5b5;
      }
    }
  }

  &-actions {
    display: flex;
    justify-content: end;

    :last-child {
      margin-right: 0;
    }

    &__btn {
      margin-right: 8px;
    }
  }

  &-input {
    &__container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      margin-bottom: 12px;
    }

    &__field {
      max-width: 240px;
    }
  }

  &-chain {
    &__container {
      padding: 16px;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 12px;
      max-width: 778px;
    }
  }

  &-actions {
    display: flex;
    justify-content: end;

    :last-child {
      margin-right: 0;
    }

    &__button {
      min-width: 234px;
      margin-right: 8px;
    }
  }
}

.request {
  &-create {
    &__container {
      display: flex;
      width: 100%;

      :last-child {
        margin-right: 0px;
      }
    }

    &__title {
      margin-right: 8px;
    }

    &__block {
      margin-right: 24px;
      width: 100%;
      max-width: 440px
    }
  }

  ;
}
</style>
