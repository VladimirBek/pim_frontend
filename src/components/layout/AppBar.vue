<template>
  <div :class="route.name.includes('das') ? 'header' : 'header--right'">
    <SearchInput v-if="route.name.includes('das')" />
    <div class="header-info">
      <v-btn density="compact" icon class="header-btn" @click="showProfile()">
        <v-icon :icon="'mdi-account'" class="header-icon"></v-icon>
      </v-btn>
      <v-btn density="compact" icon class="header-btn" @click="closeNotifications()">
        <v-icon :icon="isNewNotes ? 'mdi-bell-badge' : 'mdi-bell'" class="header-icon"></v-icon>
      </v-btn>
      <div v-if="profileShown" class="header-notifications__container">
        <div class="header-notifications__title">
          <h3>Профиль</h3> <v-icon :icon="'mdi-window-close'" @click="showProfile()"></v-icon>
        </div>
        <div class="header-notifications__item">
          <div>Ваш код для подключения уведомлений в <a href="https://t.me/int_bo_bot" target="_blank">Telegram</a>: {{ tgCode }}</div>
        </div>
      </div>
      <div v-if="notificationsShown" class="header-notifications__container">
        <div class="header-notifications__title">
          <h3>Уведомления</h3> <v-icon :icon="'mdi-window-close'" @click="closeNotifications()"></v-icon>
        </div>
        <div v-for="notification in notifications" :key="notification.id_" class="header-notifications__item">
          <div>{{ notification.text }}</div>
          <div style="font-size: 14px; color: #808080;">{{ notification.created_at_str }}</div>
        </div>
      </div>
      <div class="header-user">
        {{ surname }} {{ name }}.
      </div>
      <v-btn variant="outlined" class="me-8 button" @click="logoutSite()">
        Выйти
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logoutSite, restApi } from '@/restApi/restMethods.vue'

const route = useRoute()
const surname = ref(localStorage.getItem('surname'));
const name = ref(localStorage.getItem('name')?.charAt(0));
const userId = ref(localStorage.getItem('id'));
const notifications = ref([]);
const notificationsShown = ref(false);
const profileShown = ref(false);
const tgCode = ref('');

const getNotifications = async () => {
  await restApi.get(`/notification/notifications/${userId.value}/`).then(res => {
    notifications.value = res.data;
  })
}

const isNewNotes = computed(() => {
  return notifications.value.length > 0 && notifications.value.some(el => el.is_active)
});

const clearNotifications = async () => {
  const notification_ids = []
  notifications.value.forEach(el => {
    if (el.is_active) {
      notification_ids.push(el.id_)
    }
  })
  await restApi.patch('/notification/notifications/mark_as_unread/', {
    notification_ids
  });
}

const closeNotifications = async () => {
  if (notificationsShown.value) {
    await clearNotifications().then(getNotifications)
  }
  notificationsShown.value = !notificationsShown.value
}
const showProfile = async () => {
  if (!profileShown.value) {
    await restApi.get('/user/secret_code/get/').then(res => tgCode.value = res.data.secret_code)
  }
  profileShown.value = !profileShown.value
}

onMounted(() => {
  getNotifications();
  setInterval(() => getNotifications(), 60000)
})

</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  &--right {
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 12px 16px;
  }

  &-user {
    font-size: 20px;
    font-family: "Involve-Bold";
    margin-right: 16px;
  }

  &-info {
    display: flex;
    align-items: center;
  }

  &-icon {
    width: 30px;
    height: 30px;
  }

  &-btn {
    margin-right: 16px;
    border: none;
    width: 40px !important;
    height: 40px !important;
  }

  &-notifications {
    &__container {
      z-index: 9999;
      position: absolute;
      top: 68px;
      max-height: 660px;
      overflow-y: auto;
      background-color: #fff;
      border: 1px solid #b6b5b5;
      border-radius: 6px;
      padding: 8px;
      max-width: 525px;
    }

    &__item {
      padding: 4px;
      border: 1px solid #b6b5b5;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    &__title {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      align-items: center;
    }
  }
}
</style>
