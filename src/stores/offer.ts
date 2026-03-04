import { defineStore } from 'pinia';
import { restApi } from '@/restApi/restMethods.vue';

export const offerStore = defineStore('offer', {
    state: () => {
        return {
            offersList: [],
            selectedOffer: {},
            alertShown: false,
            errorMessage: "",
        }
    },
    actions: {
        async getOffersList() {
            await restApi.get('/marketing/blogger_offer/').then((res: { data: object; }) => {this.offersList = res.data});
        },
        async getOffer(id) {
            await restApi.get(`/marketing/blogger_offer/${id}/`).then(res => this.selectedOffer = res.data);
            this.alertShown = false;
        },
        async saveOffer(status: string) {
            const prevStatus = this.selectedOffer.status;
            this.selectedOffer.status = status;
            await restApi.patch(`/marketing/blogger_offer/${this.selectedOffer.id_}/`, this.selectedOffer).catch(error => {
                if (error.response.status === 400) {
                    this.errorMessage = error.response.data.detail;
                } else {
                    const errors = error.response.data.detail.map((el: string) => {
                        if (el === 'surname') {
                            return "Фамилия"
                        } else if (el === 'name') {
                            return "Имя"
                        } else if (el === 'middle_name') {
                            return "Отчество"
                        } else {
                            return "ОГРНИП"
                        }
                    })
                    this.errorMessage = 'Для принятия заявки и создания контрагента необходимо сверить с 1с следующие поля:' + errors.toString();
                }
                this.selectedOffer.status = prevStatus;
                this.alertShown = !this.alertShown
            })
        }
    }
})