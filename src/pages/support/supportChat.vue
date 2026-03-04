<template style="height: 100%">
    <div class="support">
        <div class="support-list">
            <div
            v-for="contact in contactList" :key="contact.id"
            class="support-list__item"
            :class="activeChatId === contact.id ? 'support-list__active' : ''"
            @click='showChat(contact.id_)'>
                {{ contact.first_name }} {{ contact.last_name }}
            <div v-if="contact.is_new_message" class="support-list__indicator"></div>
            </div>
        </div>
        <div v-if="isChatShown" class="support-chat">
            <div class="support-chat__list">
                <div v-for="message in chatHistory.messages" :key="message.id" :class="message.from_user ? '' : 'support-message__outgoing' ">
                    <div :class="message.from_user ? 'support-message__item-white' : 'support-message__item'">
                    <div class="support-message__name"> {{ message.from_user ? activeUser : 'Служба поддержки'}}</div>
                    <div>
                        {{ message.msg_text }}
                    </div>
                </div>
                </div>
            </div>
            <div class="support-chat__footer">
                <v-textarea
                    id="input"
                    v-model="messageText"
                    label="Написать сообщение"
                    variant="outlined"
                    rows="3"
                    class="support-chat__input"
                    auto-grow
                    @keyup.enter="sendMessage()">
                </v-textarea>
                <v-icon icon="mdi-send-circle" size="38px" class="support-chat__icon" @click="sendMessage()"></v-icon>
                <!-- <v-btn class="support-chat__button" @click="isModalShown = !isModalShown">
                    Закрыть обращение
                </v-btn> -->
            </div>
            <v-dialog v-if="isModalShown">
                Вы уверены что хотите закрыть обращение?
                <v-btn class="support-chat__button" >Да</v-btn>
                <v-btn>Нет</v-btn>
            </v-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { restApi } from '@/restApi/restMethods.vue';

let interval: any;
const contactList = ref([]);
const isChatShown = ref(false);
const activeChatId = ref('');
const chatHistory = ref({
    messages: [],
    uuid: '',
});
const messageText = ref('');
const isModalShown = ref(false);

definePage({
  meta: {
    title: 'Чат поддержки',
    icon: 'mdi-chat-alert-outline',
    drawerIndex: 2,
  },
})

const activeUser = computed(() => {
    const user = contactList.value.find(el => el.id_ === activeChatId.value)
    return `${user.first_name ? user.first_name : ''} ${user.last_name ? user.last_name : ''}`
})


const showChat = async (uuid: '') => {
    if (activeChatId.value) {
        clearInterval(interval)
    }
    interval = setInterval(() => { restApi.get(`/support/tg_message/by_user/${uuid}/`).then((res: { data: {}}) => {
            chatHistory.value.messages = res.data
        })
    }, 5000)
    await restApi.get(`/support/tg_message/by_user/${uuid}/`).then((res: { data: {}}) => {
        chatHistory.value.messages = res.data
    })
    activeChatId.value = uuid
    isChatShown.value = true;
    }

const getContactList = async() => {
    await restApi.get('/support/tg_user/').then((res: { data: [] }) => {
        contactList.value = res.data;
    });
}

const sendMessage = async() => {
    input.blur()
    await restApi.post(`/support/tg_message/post_message/${activeChatId.value}/`, {
        msg_text: messageText.value,
        user_uuid: activeChatId.value
        }).then(() => {
        restApi.get(`/support/tg_message/by_user/${activeChatId.value}/`).then((res: { data: {}}) => {
            chatHistory.value.messages = res.data
            messageText.value = ''
        })
    })
}
const closeRequest = async() => {
    await supportApi.post(`/support/chat/${activeChatId.value}/close`)
}

onMounted(async () => {
    await getContactList()
    setInterval(() => getContactList(), 5000)
})

</script>

<style lang="scss">
.support {
    display: flex;
    height: 100%;
    &-list {
        max-width: 220px;
        font-size: 16px;
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
            max-height: 52px;
            height: 100%;
            width: 100%;
            padding-left: 24px;
            font-weight: bold;
        }
        &__indicator {
            margin-left: 8px;
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
        &__button{
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
                background-color: #fff;
            }
        }
        &__name {
            font-weight: bold;
            margin-bottom: 4px;
        }
    }
}

</style>