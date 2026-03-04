import { defineStore } from 'pinia'
import { restApi } from '@/restApi/restMethods.vue'
import router from '@/plugins/router'

export const dasStore = defineStore('das', {
  state: () => {
    return {
      requestList: [],
      selectedRequest: {
        id_: '',
        number: 0,
        title: '',
        type: '',
        priority_type: '',
        description: '',
        initiator: {
          id_: '',
          name: '',
          surname: '',
          fullname: '',
          department: '',
          job_title: '',
          shortname: '',
        },
        status: '',
        deadline: new Date(),
        created_at: '',
        updated_at: '',
        approval_chain: [
          {
            stage_order: 1,
            deadline: null,
            approvals: [
              {
                id_: '',
                status: '',
                decided_at: null,
                user: {
                  id_: '',
                  name: '',
                  surname: '',
                  fullname: '',
                  department: '',
                  job_title: '',
                  shortname: '',
                },
              },
            ],
          },
        ],
        specific_data: {},
        observers: [],
        deadline_str: '',
        created_at_str: '',
      },
      request: {
        initiator_id: '',
        title: '',
        type: 'Свободная',
        priority_type: 'Низкий',
        description: '',
        deadline: new Date(),
        approval_chain: [],
        files: [],
        observers: [],
        links: [],
        specific_data: {},
      },
      roles: [],
      comment: {
        user_id: '',
        request_id: '',
        text: '',
        user_tags: [],
      },
      comments: [],
      users: [],
      filtredUsers: [],
      message: 'Произошла ошибка',
      alert: false,
      logs: [],
      activeFilter: 'ВСЕ ЗАЯВКИ',
      activeFilters: {},
    }
  },
  actions: {
    async getRequestsList(filter: string) {
      const userId = localStorage.getItem('id')
      await restApi
        .get(`/das/requests/${filter}/${userId}/`)
        .then((res: { data: never[] }) => {
          this.requestList = res.data
          this.getRequest(res.data[0].number_str)
          // this.getComments()
        })
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
        })
    },
    async getRequest(value: string | undefined) {
      let id = ''
      if (value) {
        id = value
      } else {
        id = router.currentRoute.value.params.id.toUpperCase()
      }
      await restApi
        .get(`/das/requests/get_one/${id}/`)
        .then((res: { data: Object }) => {
          this.selectedRequest = res.data.data
          this.roles = res.data.roles
          this.getComments()
          this.getLogs()
        })
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
        })
    },
    async getUsers() {
      await restApi
        .get('/das/requests/profiles/')
        .then((res: { data: never[] }) => {
          this.users = res.data
          this.filtredUsers = res.data
        })
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
        })
    },
    async createRequest(approvalChain, isAssist) {
      const offset = new Date().getTimezoneOffset() / 60
      this.request.deadline.setHours(18 - offset)
      this.request.approval_chain = approvalChain.map((stage) => ({
        stage_order: stage.stage_order,
        deadline: this.request.deadline,
        approvals: stage.approvals.map((user) => user.id_),
      }))
      this.request.initiator_id = localStorage.getItem('id')
      await restApi
        .post(`/das/requests/${isAssist ? 'create_from_ceo/' : ''}`, this.request)
        .then((res) => {
          approvalChain = [
            {
              stage_order: 1,
              approvals: [],
            },
          ]
          this.request = {
            initiator_id: '',
            title: '',
            type: 'Свободная',
            priority_type: 'Низкий',
            description: '',
            deadline: new Date(),
            approval_chain: [],
            files: [],
            observers: [],
            specific_data: {},
          }
          router.push('/das/requests')
        })
        .catch((err) => {
          if (
            this.request.type === 'Закупка ИТ оборудования' ||
            this.request.type === 'Закупка программного обеспечения'
          ) {
            this.request.specific_data.price =
              this.request.specific_data.price / 100
          }
          this.message = err.response.data.detail
          this.alert = true
        })
    },

    async updateRequest(approvalChain) {
      const offset = new Date().getTimezoneOffset() / 60
      this.request.deadline.setHours(18 - offset)
      this.request.approval_chain = approvalChain.map((stage) => ({
        stage_order: stage.stage_order,
        deadline: this.request.deadline,
        approvals: stage.approvals.map((user) => user.id_),
      }))
      await restApi
        .patch('/das/requests/', this.request)
        .then((res) => {
          this.request = {
            initiator_id: '',
            title: '',
            type: 'Свободная',
            priority_type: 'Низкий',
            description: '',
            deadline: new Date(),
            approval_chain: [],
            files: [],
            observers: [],
          }
          router.push(`/das/requests`)
        })
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
        })
    },

    async editFiles(file) {
      await restApi
        .post('/das/requests/add_file/', file)
        .then((res) => {})
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
        })
    },

    async requestAction(action: string) {
      const request = {
        request_id: this.selectedRequest.id_,
        reason: this.comment.text,
      }
      await restApi
        .post(`/das/requests/${action}/`, request)
        .then((this.comment.text = ''))
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
          this.comment.text = ''
        })
    },

    async getComments() {
      await restApi
        .get(`/das/comments/${this.selectedRequest.id_}/`)
        .then((res: object) => (this.comments = res.data))
        .catch((err) => {
          this.message = err.response.data.detail
          this.alert = true
        })
    },

    async sendComment() {
      if (this.comment.text) {
        this.comment.user_id = localStorage.getItem('id')
        this.comment.request_id = this.selectedRequest.id_
        await restApi
          .post('/das/comments/', this.comment)
          .then(() => {
            ;(this.comment = {
              user_id: '',
              request_id: '',
              text: '',
              user_tags: [],
            }),
              this.getComments()
          })
          .catch((err) => {
            this.message = err.response.data.detail
            this.alert = true
          })
      }
    },
    async addRequestMember(data) {
      await restApi
        .post('/das/requests/add_request_member/', data)
        .then((res) => this.getRequest())
    },

    setRequest() {
      this.request.initiator_id = this.selectedRequest.initiator.id_
      this.request.title = this.selectedRequest.title
      this.request.type = this.selectedRequest.type
      this.request.priority_type = this.selectedRequest.priority_type
      this.request.description = this.selectedRequest.description
      this.request.observers = this.selectedRequest.observers.map(
        (el) => el.observer_info.id_,
      )
      this.request.files = this.selectedRequest.files
      this.request.links = this.selectedRequest.links
      this.request.id_ = this.selectedRequest.id_
      this.request.number = this.selectedRequest.number
      this.request.deadline = new Date(this.selectedRequest.deadline)
      this.request.specific_data = this.selectedRequest.specific_data
    },

    filterUsers(value, key, chain) {
      if (value) {
        this.activeFilters[key] = value
      } else {
        delete this.activeFilters[key]
      }
      this.filtredUsers = this.users.filter((el) => {
        return Object.entries(this.activeFilters).every(
          ([filterKey, filterValue]) => {
            if (filterKey === 'department' && el.department) {
              return el.department
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            } else if (filterKey === 'job' && el.job_title) {
              return el.job_title
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            } else if (el.fullname) {
              return el.fullname
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            }
          },
        )
      })
      // if (value) {
      //   if (key === 'department') {
      //     this.filtredUsers = this.filtredUsers.filter((el) =>
      //       el.department.toLowerCase().includes(value.toLowerCase()),
      //     )
      //   } else if (key === 'job') {
      //     this.filtredUsers = this.filtredUsers.filter((el) =>
      //       el.job_title.toLowerCase().includes(value.toLowerCase()),
      //     )
      //   } else {
      //     this.filtredUsers = this.filtredUsers.filter((el) => {
      //       return el.fullname.toLowerCase().includes(value.toLowerCase())
      //     })
      //   }
      // } else {
      //   this.filtredUsers = this.users
      // }
      let chainedIds = new Set()
      if (chain) {
        chainedIds = new Set(
          chain.flatMap((el) =>
            el.approvals.map((app) => {
              return app.id_
            }),
          ),
        )
      } else {
        chainedIds = new Set(
          this.selectedRequest.approval_chain.flatMap((chain) =>
            chain.approvals.map((app) => app.user.id_),
          ),
        )
      }

      let observerIds = null;
      if (!router.currentRoute.value.name.includes('new') && !router.currentRoute.value.name.includes('edit')) {
        observerIds = new Set(
          this.selectedRequest.observers.map((obs) => obs.observer_info.id_),
        )
      }
      this.filtredUsers = this.filtredUsers.filter(
        (user) => !chainedIds.has(user.id_),
      )
      this.filtredUsers = this.filtredUsers.filter((user) => {
        return !observerIds.has(user.id_)
      })
    },
    async getLogs() {
      await restApi
        .get(`/das/logs/${this.selectedRequest.id_}/`)
        .then((res) => (this.logs = res.data))
    },
  },
  getters: {
    getExpenses: (state) => {
      return state.request.specific_data.expenses.filter(
        (el, index) =>
          el.name &&
          el.price &&
          index !== state.request.specific_data.expenses.length - 1,
      )
    },
    getTitle: (state) => {
      if (state.selectedRequest && state.selectedRequest.number) {
        const number = state.selectedRequest.number_str
        const year = new Date(state.selectedRequest.created_at).getFullYear()
        const date = state.selectedRequest.created_at_str + '.' + year
        return `Заявка №${number} от ${date}`
      }
    },
    departmentFilter: (state) => {
      return [...new Set(state.filtredUsers.map((user) => user.department))]
    },
    jobFilter: (state) => {
      return [...new Set(state.filtredUsers.map((user) => user.job_title))]
    },
    nameFilter: (state) => {
      return [...new Set(state.filtredUsers.map((el) => el.fullname))]
    },
    startDate: (state) => {
      const year = new Date(state.selectedRequest.created_at).getFullYear()
      return state.selectedRequest.created_at_str + '.' + year
    },
    finishDate: (state) => {
      const year = new Date(state.selectedRequest.deadline).getFullYear()
      return state.selectedRequest.deadline_str + '.' + year
    },
  },
})
