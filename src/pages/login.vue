<template>
  <div class="login-container">
    <div class="login-image__container">
      <v-img class="login-image" src="/logo.png"></v-img>
    </div>
    <div class="login-form__container">
      <div class="login-form">
        <h2 class="login-form__header">Авторизация</h2>
        <v-form v-model="isFormValid">
          <div>
            Логин
            <v-text-field v-model="username" density="compact" placeholder="Введите логин"
              variant="outlined" :rules="nameRules"
              @keydown.enter.prevent="login"></v-text-field>
          </div>
          <div>
            Пароль
            <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'" density="compact" placeholder="Введите пароль"
              variant="outlined" :rules="passwordRules"
              @click:append-inner="visible = !visible" @keydown.enter.prevent="login"></v-text-field>
          </div>
        </v-form>

        <v-btn :disabled="!isFormValid" class="button" :class="isFormValid ? 'button-primary' : 'button-disabled' " @click="login()">
          Войти
        </v-btn>
      </div>
    </div>
  </div>
  <AppNotification />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'


const router = useRouter()
const store = useUserStore()

const username = ref('')
const password = ref('')
const visible = ref(false)
const isFormValid = ref(false)

const nameRules = ref([
  value => value ? true : 'Необходимо заполнить логин'
])

const passwordRules = ref([
  value => value ? true : 'Необходимо заполнить пароль'
])

const login = async () => {
  await store.login(username.value, password.value).then(() => {
    router.push({ path: '/backoffice' })
  }).catch(err => {
    console.error(err);
    errorAndResetForm()
    username.value = ''
    password.value = ''
  })
}

const errorAndResetForm = () => {
  Notify.error(`Неверно указаны логин или пароль`)
  username.value = ''
  password.value = ''
}

onBeforeMount(() => {
  if (localStorage.getItem('token')) {
    router.push('/das/requests')
  }
})
</script>

<style lang="scss" scoped>
.login {
  &-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-height: 100%;
    background-color: #F0F0F3;
  }

  &-image {
    max-height: 1100px;
    &__container {
      padding: 80px 40px;
      background-color: #2C2E33;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &-form {
    max-width: 320px;
    width: 100%;

    &__container {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__header {
      margin-bottom: 16px;
    }
  }
}
</style>
