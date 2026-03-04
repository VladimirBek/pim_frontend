<template>
  <div class="request-container">
    <v-form ref="form" @submit.prevent="createRequest">
      <h2 class="request-header">Новая заявка</h2>
      <div class="request">
        <div class="request-create__container">
          <div class="request-create__block">
            <div class="create-input__container">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Название заявки</h3>
              <v-text-field :model-value="store.request.title" variant="outlined" placeholder="Введите название заявки"
                :rules="textRules" required density="compact" class="create-input__field"
                @update:model-value="store.request.title = $event"></v-text-field>
            </div>
            <div class="create-input__container">
              <h3 class="request-create__title">Приоритет</h3>
              <v-select :model-value="store.request.priority_type" variant="outlined"
                :items="['Низкий', 'Средний', 'Высокий']" label="Выберите приоритет" density="compact" hide-details
                class="create-input__field" @update:model-value="store.request.priority_type = $event"></v-select>
            </div>
          </div>
          <div class="request-create__block">
            <div class="create-input__container">
              <h3 class="request-create__title" style="padding-bottom: 22px;">Согласовать до</h3>
              <v-date-input v-model="store.request.deadline" prepend-icon="" prepend-inner-icon="$calendar"
                label="Выберите дату" :min="minDate" placeholder="дд.мм.гггг" density="compact" variant="outlined"
                class="create-input__field" :rules="dateRules" required
                @update:model-value="store.request.deadline = new Date($event)"></v-date-input>
            </div>
            <div class="create-input__container">
              <h3 class="request-create__title">Тип заявки</h3>
              <v-select :model-value="store.request.type" variant="outlined" :items="requestTypes" label="Выберите тип"
                density="compact" hide-details class="create-input__field"
                @update:model-value="setType($event)"></v-select>
            </div>
          </div>
          <div v-if="store.request.type === 'Выдача подотчётных ДС'" class="request-create__block">
            <div class="create-input__container">
              <h3 class="request-create__title">Способ выдачи</h3>
              <v-select :model-value="store.request.specific_data.cardType" :items="cardTypes" item-title="name"
                item-value="type" variant="outlined" label="Выберите приоритет" density="compact" hide-details
                class="create-input__field"
                @update:model-value="store.request.specific_data.cardType = $event"></v-select>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 12px;">
        <div v-if="isPaymentRequest" class="request-expense__container" style="margin-bottom: 12px;">
          <h3>
            Расходы
          </h3>
          <div class="request-files__list">
            <div v-for="expense in store.getExpenses" :key="expense" class="chain-item__container">
              <div class="chain-item__name chain-item__name--pause" style="white-space: nowrap;  overflow: hidden;">
                {{ expense.name }}</div>
              <div class="chain-item__name request-expense__price chain-item__name--pause"
                style="white-space: nowrap;  overflow: hidden;">
                {{ expense.price }}</div>
              <v-icon :icon="'custom:close-box'" style="color: #D32F2F; cursor: pointer;"
                @click="deleteExpense(expense)"></v-icon>
            </div>
            <div v-if="store.request.specific_data.expenses.length > 0" class="chain-item__container">
              <v-text-field v-model="expenseName" class="request-expense__name" density="compact" variant="outlined"
                placeholder="Наименование" hide-details @update:model-value="expenseName = $event"></v-text-field>
              <v-text-field v-model="expensePrice" class="request-expense__price" density="compact" variant="outlined"
                placeholder="Сумма" hide-details @update:model-value="createExpense($event)"></v-text-field>
              <v-icon :icon="'custom:close-box'" style="color: #D32F2F; cursor: pointer;"
                @click="deleteExpense(expense)"></v-icon>
              <!-- <v-icon :icon="'custom:plus-box'" style="color: #2E7D32; cursor: pointer;" @click="addExpense()"></v-icon> -->
            </div>
            <div class="chain-item__container">
              <v-btn class="button-secondary" style="width: 100%;" @click="addExpense()">Добавить</v-btn>
            </div>
            <div v-if="store.request.specific_data.expenses.length > 0" class="request-expense__total">
              Общая сумма: {{ store.request.specific_data.totalSum }}
            </div>
          </div>
        </div>
        <div v-if="isITRequest">
          <div class="request-create__container">
            <div class="request-create__block">
              <div class="create-input__container" style="margin-bottom: 0;">
                <h3 class="request-create__title" style="padding-bottom: 22px;">Наименование</h3>
                <v-text-field :model-value="store.request.specific_data.name" variant="outlined"
                  placeholder="Введите название" :rules="textRules" required density="compact"
                  class="create-input__field"
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
                  <div v-if="chain.stage_order !== 1" class="create-chain__icon">
                    <v-icon :icon="'custom:trash'" @click="deleteChain(chain.stage_order)"></v-icon>
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
              <h3>
                Наблюдатели
              </h3>
              <div class="chain-step__container " style="max-height: 175px; height: 100%;">
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
      </div>
      <div class="request-additional__container" style="width: 100%; max-width: 778px;">
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
      </div>

      <div class="create-actions" style="">
        <v-btn class="button-secondary create-actions__button" @click="cancelCreate()">Отмена</v-btn>
        <v-btn class="button create-actions__button" @click="createRequest()">Отправить на согласование</v-btn>
        <v-btn v-if="isAssist" class="button create-actions__button" @click="createRequest('ceo')">Создать от руководителя</v-btn>
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
              <div>
                <v-combobox :items="store.departmentFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите департамент" clearable hide-details
                  class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'department', chainList)" />
              </div>
            </div>
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                Должность
              </div>
              <div>
                <v-combobox :items="store.jobFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите должность" clearable hide-details
                  class="create-dialog__input" @update:model-value="store.filterUsers($event, 'job', chainList)" />
              </div>
            </div>
            <div class="create-dialog__field">
              <div class="create-dialog__title">
                ФИО
              </div>
              <div>
                <v-combobox :items="store.nameFilter" prepend-inner-icon="mdi-magnify" density="compact"
                  variant="outlined" placeholder="Выберите ФИО" clearable hide-details class="create-dialog__input"
                  @update:model-value="store.filterUsers($event, 'name', chainList)" />
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
                <v-icon :icon="'custom:plus'"></v-icon>
              </div>
              <div v-else>
                <v-icon :icon="'custom:check'"></v-icon>
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
          Вы уверены что хотите создать заявку? Пустые этапы будут удалены.
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

const store = dasStore();
const chainList = ref([
  {
    stage_order: 1,
    approvals: []
  }
]);
const observers = ref([]);
const shownObservers = ref([]);
const approvals = ref([]);
const fileList = ref([]);
const isShown = ref(false);
const approvalDialog = ref(false);
const stage_order = ref(1);
const isDialogAlert = ref(false);
const form = ref(null)
const requiredRule = (value) => !!value || "Обязательно для заполнения";
const textRules = [requiredRule];
const dateRules = [requiredRule];
const shownPrice = ref(null)
const linkValue = ref('');
const expenseName = ref('');
const expensePrice = ref('');
const requestTypes = ref([
  'Свободная',
  'Компенсация ДС',
  'Компенсация командировочных расходов',
  'Выдача подотчётных ДС',
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
const cardTypes = ref([
  {
    type: 'corporate',
    name: 'Корпоративная карта',
  },
  {
    type: 'salary',
    name: 'Зарплатная карта'
  }
]);
const minDate = new Date().toISOString().split('T')[0]

const getIcon = (user) => {
  const userIncludes = approvalDialog.value ? approvals.value.some(el => el.id_ === user.id_) : observers.value.some(el => el.id_ === user.id_)
  return userIncludes ? 'check' : 'plus'
}

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

const isAssist = computed(() => {
  return localStorage.getItem('id') === "0637759d-2a4e-4127-8683-08e88fda7217"
})
// const addLink = () => {
//   if (linkValue.value) {
//     store.request.links.push(linkValue.value);
//     linkValue.value = ''
//   }
// }

// const deleteLink = (value) => {
//   if (value) {
//     const index = store.request.links.findIndex(el => elr === value);
//     if (index !== -1) {
//       store.request.links.splice(index, 1);
//     }
//   }
// }

const addExpense = () => {
  const lastExpense = store.request.specific_data.expenses.at(-1)
  if (!lastExpense || (lastExpense.name && lastExpense.price)) {
    store.request.specific_data.expenses.push({
      name: '',
      price: '',
    })

    expenseName.value = ''
    expensePrice.value = ''
  }
}

const setPrice = (value) => {
  shownPrice.value = value.replace(/[^0-9.,]/g, '').replace(/\s+/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
  store.request.specific_data.price = value.replace(/[^0-9.,]/g, '').replace(/\s+/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
}

const createExpense = (value) => {
  expensePrice.value = value;
  if (expenseName.value && expensePrice.value) {
    store.request.specific_data.expenses.at(-1).name = expenseName.value;
    store.request.specific_data.expenses.at(-1).price = expensePrice.value.replace(/[^0-9.,]/g, '').replace(/\s+/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
    store.request.specific_data.totalSum = store.request.specific_data.expenses.length > 1 ? store.request.specific_data.expenses.reduce((acc, num) => {
      if (acc.price) {
        return Number(acc.price) + Number(num.price)
      } else {
        return Number(acc) + Number(num.price)
      }
    }) : expensePrice.value.replace(/[^0-9.,]/g, '').replace(/\s+/g, '').replace(/\.(?=.*\.)/g, '').replace(',', '.');
    store.request.specific_data.totalSum = store.request.specific_data.totalSum.toString();
  }
}

const deleteExpense = (value) => {
  if (value) {
    const index = store.request.specific_data.expenses.findIndex(el => el === value);
    if (index !== -1) {
      store.request.specific_data.expenses.splice(index, 1);
    }
  } else {
    store.request.specific_data.expenses.pop()
  }
  store.request.specific_data.totalSum = store.request.specific_data.expenses.length > 1 ? store.request.specific_data.expenses.reduce((acc, num) => {
    if (acc.price) {
      return Number(acc.price) + Number(num.price)
    } else {
      return Number(acc) + Number(num.price)
    }
  }) : expensePrice.value
}

const setType = (value) => {
  store.request.type = value
  if (isPaymentRequest.value) {
    store.request.specific_data = {
      expenses: [],
      cardType: '',
      totalSum: '',
    }
  } else {
    store.request.specific_data = {}
  }
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
  router.push('/das/requests')
}

const deleteApproval = (step, member) => {
  const chain = chainList.value.find((el) => el.stage_order === step);
  if (chain) {
    chain.approvals = chain.approvals.filter(el => el.id_ !== member)
  }
};

const isPaymentRequest = computed(() => {
  return store.request.type === 'Компенсация ДС' || store.request.type === 'Компенсация командировочных расходов' || store.request.type === 'Выдача подотчётных ДС'
});

const isITRequest = computed(() => {
  return store.request.type === 'Закупка программного обеспечения' || store.request.type === 'Закупка ИТ оборудования'
});



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

const deleteObserver = (member) => {
  observers.value = observers.value.filter(el => el.id_ !== member)
  store.request.observers = store.request.observers.filter(el => el !== member)
  shownObservers.value = shownObservers.value.filter(el => el.id_ !== member)
};

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
  await store.createRequest(chainList.value).then(
    chainList.value = [
      {
        stage_order: 1,
        approvals: []
      }]
  )
}

const createRequest = async (role) => {
  const isValid = await form.value.validate();
  if (isValid) {
    if (chainList.value.some(el => el.approvals.length === 0)) {
      isDialogAlert.value = !isDialogAlert.value;
    } else {
      if (isPaymentRequest.value) {
        store.request.specific_data.expenses = store.request.specific_data.expenses.filter(el => {
          return el.name !== '' && el.price !== ''
        })
      }
      if (isITRequest.value) {
        store.request.specific_data.price = store.request.specific_data.price * 100
      }
      const isCeo = role === 'ceo' && isAssist.value
      store.createRequest(chainList.value, isCeo).then(store.activeFilter = 'МОИ ЗАЯВКИ').catch(err => {
        console.error(err);
      });
    }
  }
}

const addMember = (user, action) => {
  let isMember = approvalDialog.value ? approvals.value.includes(user) : observers.value.includes(user);
  if (!isMember) {
    approvalDialog.value ? approvals.value.push(user) : observers.value.push(user);
  } else {
    approvalDialog.value ? approvals.value = approvals.value.filter(el => el.id_ !== user.id_) : observers.value = observers.value.filter(el => el.id_ !== user.id_);
  }
}

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

const createChain = () => {
  if (approvalDialog.value) {
    chainList.value.find((el) => el.stage_order === stage_order.value).approvals = chainList.value.find((el) => el.stage_order === stage_order.value).approvals.concat(approvals.value)
    approvals.value = []
  } else {
    shownObservers.value = [...observers.value];
    store.request.observers = observers.value.map(el => el.id_)
  }
  isShown.value = false
};

const deleteFile = (file) => {
  store.request.files = store.request.files.filter(el => el.aws_id !== file.aws_id)
}

onMounted(() => {
  store.getUsers();
  store.request.deadline = new Date(new Date().setDate(new Date().getDate() + 3))
  // store.request.deadline = store.request.deadline.toISOString()
})

</script>

<style lang="scss">
.link {
  width: 100%;
  margin-right: 4px;
}

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

    &--mini {
      max-width: 640px;
    }

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
      display: flex;
      border-radius: 4px;
      border: 1px solid #b6b5b5;
      padding: 4px 0;
      font-size: 14px;
      align-items: center;

      &:hover {
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

    &__icon {
      display: flex;
      justify-content: end;
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
  &-expense {
    &__container {
      max-width: 430px;
      width: 100%;
    }

    &__name {
      margin-right: 4px;
    }

    &__price {
      max-width: 138px;
      margin-right: 4px;
    }

    &__total {
      padding-top: 4px;
      margin-right: 10px;
      max-width: 380px;
      display: flex;
      justify-content: end;
    }
  }

  &-files {
    &__items {
      margin-bottom: 2px;
      margin-right: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

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
      font-size: 18px;
    }

    &__block {
      margin-right: 24px;
      width: 100%;
      max-width: 430px
    }
  }

  ;
}
</style>
