import { defineStore } from 'pinia'
import { formApi, restApi } from '@/restApi/restMethods.vue'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {
        roles: [],
        username: ""
      },
      users: [],
    }
  },
  actions: {
    async login(name, password) {
      await restApi.post('/user/', {
        'name': name,
        'password': password
      }).then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('roles', JSON.stringify(res.data.roles));
        localStorage.setItem('surname', res.data.surname);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('id', res.data.id_);
        restApi.defaults.headers['x-token'] = res.data.token;
        formApi.defaults.headers['x-token'] = res.data.token;
      })
    },
    async getUsers() {
      await restApi.post('/users').then(res => {
        this.users = res.data
      })
    }
  }
})
