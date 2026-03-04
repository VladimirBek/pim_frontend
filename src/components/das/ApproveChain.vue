<template>
  <div style="max-width: 1024px; width: 100%;">
    <div class="chain-header">Согласующие:</div>
    <div class="chain-container">
      <div class="chain-list">
        <div>Старт</div>
        <div class="chain-list__date">{{ store.startDate }}</div>
      </div>
      <div v-for="chain in store.selectedRequest.approval_chain" :key="chain.id_" class="chain-list">
        <div>Этап {{ chain.stage_order }}</div>
        <div v-if="chain.approvals.length > 0" class="chain-step__container">
          <div v-for="approver in chain.approvals" :key="approver.id_" class="chain-item__container">
            <div class="chain-item__name" :class="getColor(approver.status)">{{ approver.user.shortname }}</div>
            <v-icon :icon="getIcon(approver.status)"></v-icon>
          </div>
          <div v-if="approverAvailable(chain)" class="chain-item__container">
            <v-btn class="button-secondary" style="width: 100%;" @click="openDialog(chain.stage_order)">Добавить</v-btn>
          </div>
        </div>
      </div>
      <div class="chain-list">
        <div>Завершение</div>
        <div class="chain-list__date">{{ store.finishDate }}</div>
      </div>
    </div>
    <v-dialog v-model="isShown" class="create-dialog">
      <v-card class="create-dialog__container">
        <h2>Выберите согласующего</h2>
        <!-- <v-text-field prepend-inner-icon="mdi-magnify" variant="outlined" placeholder="Поиск"></v-text-field> -->
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
              <div v-if="getIconRound(user) === 'plus'">
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
          <v-btn class="button create-actions__btn" @click="addApprover()">Применить</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { dasStore } from '@/stores/das';

const store = dasStore();
const chainList = ref([
  {
    stage_order: 1,
    approvals: []
  }
]);
const approvals = ref([]);
const isShown = ref(false);
const stage_order = ref(1);

const props = defineProps({
  isDetail: {
    type: Boolean,
    required: false,
    default: () => false
  },
})

const getColor = (status: string) => {
  let className = "chain-item__name--pause"
  if (status === 'Согласовано') {
    className = "chain-item__name--approve"
  } else if (status === 'Отклонено') {
    className = "chain-item__name--reject"
  } else if (status === 'На доработке') {
    className = "chain-item__name--rework"
  }
  return className
};

const getIcon = (status: string) => {
  let className = "custom:circle-play"
  if (status === 'Согласовано') {
    className = "custom:circle-check"
  } else if (status === 'Отклонено') {
    className = "custom:circle-reject"
  } else if (status === 'На доработке') {
    className = "custom:circle-question"
  } else if (status === 'В очереди') {
    className = "custom:circle-pause"
  }
  return className
};

const approverAvailable = (chain) => {
  return props.isDetail && store.selectedRequest.status !== 'Отклонено' && store.selectedRequest.status !== 'Согласовано' && store.selectedRequest.status !== 'Отозвано' && chain.status !== 'Согласовано'
}

const getIconRound = (user) => {
  const userIncludes = approvals.value.some(el => el.id_ === user.id_)
  return userIncludes ? 'check' : 'plus'
}

const openDialog = (order) => {
  const chainedIds = new Set(
    store.selectedRequest.approval_chain.flatMap(chain =>
      chain.approvals.map(app => app.user.id_)
    ));
  store.filtredUsers = store.filtredUsers.filter(user => user.id_ !== store.selectedRequest.initiator.id_)
  const observerIds = new Set(store.selectedRequest.observers.map(obs => obs.observer_info.id_));
  store.filtredUsers = store.filtredUsers.filter(user => !chainedIds.has(user.id_))
  store.filtredUsers = store.filtredUsers.filter(user => !observerIds.has(user.id_))
  chainList.value.forEach(chain => {
    chain.approvals.forEach(approval => {
      store.filtredUsers = store.filtredUsers.filter(user => {
        return approval.id_ !== user.id_
      })
    })
  });
  isShown.value = !isShown.value;
  stage_order.value = order
}

const addMember = (user, action) => {
  if (action === 'add') {
    approvals.value.push(user)
  } else {
    approvals.value = approvals.value.filter(el => el.id_ !== user.id_)
  }
}


const addApprover = () => {
  const stageId = store.selectedRequest.approval_chain.find(el => el.stage_order === stage_order.value)?.id_
  const members = approvals.value.map(approver => ({
    stage_id: stageId,
    user_id: approver.id_,
    role: "Согласующий"
  }));
  const data = {
    request_id: store.selectedRequest.id_,
    members: members
  };
  store.addRequestMember(data).then(res => isShown.value = !isShown.value)
}

</script>
<style lang="scss">
.chain {
  &-container {
    padding: 16px;
    border: 1px solid #b6b5b5;
    border-radius: 6px;
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 4px;
  }

  &-list {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 8px;
    max-width: 240px;
    // width: 100%;

    &__date {
      padding: 6px 24px;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
    }
  }

  &-step {
    &__container {
      padding: 6px;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      min-height: 120px;
      width: 240px;
      max-height: 120px;
      overflow-y: auto;
    }
  }

  &-item {
    &__container {
      display: flex;
      align-items: center;
      margin-bottom: 2px;
    }

    ;

    &__name {
      padding: 6px;
      border-radius: 4px;
      margin-right: 4px;
      width: 100%;

      &--approve {
        background-color: #2E7D32;
      }

      &--rework {
        background-color: #FBC02D;
      }

      &--pause {
        border: 1px solid #b6b5b5;
      }

      &--reject {
        background-color: #D32F2F;
      }
    }
  }
}
</style>
