<template>
  <div class="support">
    <div class="support-menu">
      <v-tabs v-model="tab" @update:model-value="isChatShown = false">
        <v-tab :value="'C+'">C+ <div v-if="cpNewMessages" class="support-list__indicator"></div></v-tab>
        <v-tab :value="'TMS'">TMS <div v-if="tmsNewMessages" class="support-list__indicator"></div></v-tab>
        <v-tab :value="'Cosmetime'">Cosmetime <div v-if="ctNewMessages" class="support-list__indicator"></div></v-tab>
        <v-tab :value="'HAIROSA'">HAIROSA <div v-if="hsNewMessages" class="support-list__indicator"></div></v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="support-tab">
        <div class="support-list">
          <div v-for="contact in contactList" :key="contact.id" class="support-list__item"
            :class="activeChatId === contact.id_ ? 'support-list__active' : ''" @click='showChat(contact.id_)'>
            {{ contact.first_name }} {{ contact.last_name }}
            <div v-if="contact.is_new_message" class="support-list__indicator"></div>
          </div>
        </div>
      </v-tabs-window>
    </div>
    <div v-if="isChatShown" class="support-chat">
      <div class="support-chat__list">
        <div v-for="message in messages" :key="message.id"
          :class="message.from_user ? '' : 'support-message__outgoing'">
          <div :class="message.from_user ? 'support-message__item-white' : 'support-message__item'">
            <div class="support-message__name"> {{ message.from_user ? activeUser : 'Служба поддержки' }}
            </div>
            <div>
              {{ message.msg_text }}
            </div>
          </div>
        </div>
      </div>
      <div class="support-chat__footer">
        <v-textarea id="input" v-model="messageText" label="Написать сообщение" variant="outlined" auto-grow
          class="support-chat__input" @keyup.enter="sendMessage()">
        </v-textarea>
        <v-icon icon="mdi-send-circle" size="38px" class="support-chat__icon" @click="sendMessage()"></v-icon>
      </div>
      <v-dialog v-if="isModalShown">
        Вы уверены что хотите закрыть обращение?
        <v-btn class="support-chat__button">Да</v-btn>
        <v-btn>Нет</v-btn>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { restApi } from '@/restApi/restMethods.vue';

let interval: any;
const cpContacts = ref([]);
const tmsContacts = ref([]);
const ctContacts = ref([]);
const hsContacts = ref([]);
const isChatShown = ref(false);
const activeChatId = ref('');
const chatHistory = ref({
  cpMessages: [],
  tmsMessages: [],
  ctMessages: [],
  hsMessages: [],
  uuid: '',
});
const messageText = ref('');
const isModalShown = ref(false);
const tabs = ref([
  'C+',
  'TMS',
  'Cosmetime'
]);
const tab = ref('C+');

definePage({
  meta: {
    title: 'Служба поддержки',
    icon: 'mdi-chat-alert-outline',
    drawerIndex: 8,
  },
})

const cpNewMessages = computed(() => {
  return cpContacts.value.some(el => el.is_new_message)
})
const tmsNewMessages = computed(() => {
  return tmsContacts.value.some(el => el.is_new_message)
})
const ctNewMessages = computed(() => {
  return ctContacts.value.some(el => el.is_new_message)
})
const hsNewMessages = computed(() => {
  return hsContacts.value.some(el => el.is_new_message)
})

const activeUser = computed(() => {
  const user = contactList.value.find(el => el.id_ === activeChatId.value)
  return `${user.first_name ? user.first_name : ''} ${user.last_name ? user.last_name : ''}`
})

const contactList = computed(() => {
  if (tab.value === 'TMS') {
    return tmsContacts.value
  } else if (tab.value === 'C+') {
    return cpContacts.value
  } else if (tab.value === 'Cosmetime') {
    return ctContacts.value
  } else {
    return hsContacts.value
  }
});

const messages = computed(() => {
  let messageList = []
  if (tab.value === 'TMS') {
    messageList = chatHistory.value.tmsMessages
  } else if (tab.value === 'C+') {
    messageList = chatHistory.value.cpMessages
  } else if (tab.value === 'Cosmetime') {
    messageList = chatHistory.value.ctMessages
  } else {
    messageList = chatHistory.value.hsMessages
  }
  return messageList
})


const showChat = async (uuid: '') => {
  if (activeChatId.value) {
    clearInterval(interval)
  }
  interval = setInterval(() => {
    restApi.get(`/support/tg_message/by_user/${uuid}/`).then((res: { data: [] }) => {
      const newMessages = res.data.filter(el => el.brand_name)
      chatHistory.value.tmsMessages = newMessages.filter(el => el.brand_name === 'ToMySkin')
      chatHistory.value.cpMessages = newMessages.filter(el => el.brand_name === 'clean')
      chatHistory.value.ctMessages = newMessages.filter(el => el.brand_name === 'Cosmetime')
      chatHistory.value.hsMessages = newMessages.filter(el => el.brand_name === 'Hairosa')
    })
  }, 5000)
  await restApi.get(`/support/tg_message/by_user/${uuid}/`).then((res: { data: [] }) => {
    const newMessages = res.data.filter(el => el.brand_name)
      chatHistory.value.tmsMessages = newMessages.filter(el => el.brand_name === 'ToMySkin')
      chatHistory.value.cpMessages = newMessages.filter(el => el.brand_name === 'clean')
      chatHistory.value.ctMessages = newMessages.filter(el => el.brand_name === 'Cosmetime')
      chatHistory.value.hsMessages = newMessages.filter(el => el.brand_name === 'Hairosa')
  })
  activeChatId.value = uuid
  isChatShown.value = true;
}

const getContactList = async () => {
  await restApi.get('/support/tg_user/ToMySkin').then((res: { data: [] }) => {
    tmsContacts.value = res.data;
  }).catch(err => console.error(err));
  await restApi.get('/support/tg_user/clean').then((res: { data: [] }) => {
    cpContacts.value = res.data;
  }).catch(err => console.error(err));
  await restApi.get('/support/tg_user/Cosmetime').then((res: { data: [] }) => {
    ctContacts.value = res.data;
  }).catch(err => console.error(err));
  await restApi.get('/support/tg_user/Hairosa').then((res: { data: [] }) => {
    hsContacts.value = res.data;
  }).catch(err => console.error(err));
}

const sendMessage = async () => {
  input.blur();
  await restApi.post(`/support/tg_message/post_message/${activeChatId.value}/`, {
    msg_text: messageText.value,
    user_uuid: activeChatId.value,
    brand_name: messages ? messages.value[0].brand_name : '',
  }).then(() => {
    restApi.get(`/support/tg_message/by_user/${activeChatId.value}/`).then((res: { data: [] }) => {
      const newMessages = res.data.filter(el => el.brand_name)
      chatHistory.value.tmsMessages = newMessages.filter(el => el.brand_name === 'ToMySkin')
      chatHistory.value.cpMessages = newMessages.filter(el => el.brand_name === 'clean')
      chatHistory.value.ctMessages = newMessages.filter(el => el.brand_name === 'Cosmetime')
      chatHistory.value.hsMessages = newMessages.filter(el => el.brand_name === 'Hairosa')
      messageText.value = ''
    })
  })
}

onMounted(async () => {
  await getContactList()
  setInterval(() => getContactList(), 15000)
})

</script>

<style scoped lang="scss">
.support {
  display: flex;
  height: 100%;

  &-menu {
    height: 100%;
  }

  &-list {
    max-width: 320px;
    font-size: 16px;
    max-height: 100vh;
    height: 100%;
    width: 100%;
    background-color: #fff;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-padding: 50px 0 0 0;

    &__item {
      display: flex;
      align-items: center;
      min-height: 32px;
      max-height: 52px;
      height: 100%;
      width: 100%;
      padding-left: 24px;
      font-weight: bold;

      &:hover {
        background-color: #b6b5b5;
      }
    }

    &__active {
      border-left: 4px solid #000;
      color: #000;
      background-color: rgba(149, 149, 149, 0.4);
    }

    &__indicator {
      margin-left: 4px;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      background-color: #F98100;
    }
  }

  &-chat {
    padding: 48px 72px 12px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-height: inherit;
    overflow-y: auto;

    &__footer {
      display: flex;
      justify-content: center;
      align-items: center;

    }

    &__list {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
    }

    &__input {
      max-width: 800px;
      margin-right: 6px;
    }

    &__icon {
      margin-right: 12px;
    }

    &__button {
      background-color: #F98100;
      color: #fff;
      text-transform: none;
      letter-spacing: normal;
      text-decoration: none;
      font-size: 16px;
    }
  }

  &-message {
    &__outgoing {
      display: flex;
      justify-content: end;

    }

    &__item {
      background-color: rgb(238, 255, 222);
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      display: inline-block;
      max-width: 30vw;

      &-white {
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 12px;
        display: inline-block;
        max-width: 30vw;
        background-color: rgba(149, 149, 149, 0.4);
      }
    }

    &__name {
      font-weight: bold;
      margin-bottom: 4px;
    }
  }
}
</style>
