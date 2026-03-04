import { defineStore } from 'pinia';
import { restApi, formApi } from '@/restApi/restMethods.vue';

export const partnerStore = defineStore('partner', {
    state: () => {
        return {
            role: '',
            partnersList: [],
            selectedPartner: {
                status: "",
                id_: "",
                blogger_offer_id: "",
                blogger_offer: {
                    legal_form: "",
                },
            },
            document: {
                id: "",
                counterparty_name: "",
                counterparty_surname: "",
                counterparty_middle_name: "",
                blogger_offer_id: "",
                email: "",
                rows: [
                    {

                        advertisement_characteristic: "",
                        date_of_publication: "",
                        advertisement_link: "",
                        period_of_distribution: "",
                        period_measurement: "",
                        price: 0,
                        base_attachment_id: "",
                        advertisement_place: "",
                        account: "",
                        participation: "",
                        timer: "",
                        id_: ""
                    },
                ]
            },
            act: {
                offer_attachment_file_id: "",
            },
            publication_files: [],
            receivedFiles: [],
            sendedFiles: [],
            docFiles: [],
            signedFiles: [],
            openedFile: {
                blogger_id: "",
                document_type: "",
                document_status: "",
            },
            createdAttachments: [],
            attachmentCreated: false,
            publicationsCreated: false,
        }
    },
    actions: {
        async getPartnersList() {
            await restApi.get('/marketing/blogger_partner/').then((res: { data: object; }) => this.partnersList = res.data);
        },
        async getPartner(id: string) {
            await restApi.get(`/one_c/blogger/${id}/`).then((res: {data: object}) => {
                this.selectedPartner = res.data;
                this.attachmentCreated = false,
                this.publicationsCreated = false,
                this.docFiles = [];
                this.receivedFiles = [];
                this.signedFiles = [];
                this.sendedFiles = [];
                const date = new Date(this.selectedPartner.blogger_offer.passport_date)
                const year = date.getFullYear()
                const month = date.getMonth()+1
                const day = date.getDate()
                const lessThan10 = x => x < 10 ? '0' : ''
                this.selectedPartner.blogger_offer.passport_date = `${lessThan10(day)}${day}.${lessThan10(month)}${month}.${year}`
            });
            await this.getApplication().catch((error: any) => console.error(error));
            await restApi.get(`/marketing/blogger_file/${this.selectedPartner.blogger_offer_id}/`).then((res: { data: any[]; }) => {
                const filtredFiles = res.data.filter(el => el.document_type !== "Публикация").slice(0,10);
                filtredFiles.forEach((el: { aws_id: any; }) => {
                    restApi.get(`/aws/blogger_offer/${el.aws_id}/`).then((res: { data: { result: any; }; }) => {
                          const file = {
                          aws_id: el.aws_id,
                          blogger_id: el.blogger_id,
                          code: res.data.result.data,
                          filename: res.data.result.filename,
                          document_type: el.document_type,
                          document_status: el.document_status,
                          id: el.id_,
                        }
                        if (file.document_type === 'ИНН' || file.document_type === 'ОГРН' || file.document_type === 'Паспорт') {
                            this.docFiles.push(file);
                        } else if (file.document_status === 'Получено') {
                            if (file.document_type !== 'Публикация') {
                                this.receivedFiles.push(file);
                            }
                        } else if (file.document_status === "Подписан") {
                            this.signedFiles.push(file);
                        } else {
                            this.sendedFiles.push(file);
                        }
                })
                });
              }).catch((error: any) => console.error(error))
        },
        async savePartner(status: string) {
            this.selectedPartner.status = status
            await restApi.patch(`/marketing/blogger_partner/${this.selectedPartner.id_}/`, this.selectedPartner)
        },
        openDocDialog() {
            this.document.counterparty_name = this.selectedPartner.i;
            this.document.counterparty_surname = this.selectedPartner.f;
            this.document.counterparty_middle_name = this.selectedPartner.o;
            this.document.blogger_offer_id = this.selectedPartner.blogger_offer_id;

        },
        closeDocDialog() {
            this.document = {
                counterparty_name: "",
                counterparty_surname: "",
                counterparty_middle_name: "",
                blogger_offer_id: "",
                rows: [
                    {
                        advertisement_characteristic: "",
                        date_of_publication: "",
                        period_of_distribution: "",
                        period_measurement: "",
                        price: 0,
                        base_attachment_id: "",
                        advertisement_place: "",
                        account: "",
                        participation: "",
                        timer: "",
                        advertisement_link: "",
                        id_: ""
                    },
                ]
            };
        },
        async updateFile(status: string) {
            this.openedFile.document_status = status;
           await restApi.patch(`/marketing/blogger_file/${this.openedFile.id}/`, this.openedFile).then(() => {
                this.openedFile.document_type = "";
                this.closeDocDialog
            })
        },
        addRows() {
            const row = {
                advertisement_characteristic: "",
                date_of_publication: "",
                period_of_distribution: "",
                period_measurement: "",
                price: 0,
                base_attachment_id: "",
                advertisement_place: "",
                account: "",
            };
            this.document.rows.push(row)
        },
        async sendApplication() {
            await restApi.post(`/marketing/attachment/${this.document.id}/`).then(async (res) => {
                const mail = {
                    msg_subj: "Документы Integraaal",
                    msg_email: this.document.email,
                    msg_text: 'Добрый день! В скором времени у нас запланировано сотрудничество между вами и ООО "Интеграаал" (такие бренды как Clean+, To My Skin, Cosmetime и др). Во вложении направляем документы, которые необходимо подписать и направить сканы ответным письмом на эту почту. Заранее спасибо.',
                    attachments: [],
                    comment: ""
                }
                mail.attachments.push(res.data.bill_id);
                res.data.attachment_id.forEach(el => mail.attachments.push(el))
                await restApi.post('/email/', mail).then(this.closeDocDialog());
            })
        },
        async saveApplication(role: string) {
            if (!this.attachmentCreated) {
                await restApi.post('/marketing/attachment/', this.document).then(async (res) => {
                    this.document.rows.forEach(el => {
                        el.base_attachment_id = res.data.id_;
                        el.advertisement_characteristic = el.advertisement_characteristic + el.timer + el.participation
                    });
                    await restApi.post('/marketing/attachment_row/', this.document.rows).then(this.closeDocDialog())
                    this.attachmentCreated = !this.attachmentCreated;
                })
            } else {
                const rows = [];
                this.document.rows.forEach(async (el) => {
                    if (el.id_) {
                        await restApi.patch(`/marketing/attachment_row/${el.id_}/`, el);
                    } else {
                        el.base_attachment_id = this.document.id;
                        rows.push(el);
                    }
                })
                if (rows) {
                    await restApi.post('/marketing/attachment_row/', rows)
                }
                this.closeDocDialog();
            }
        },
        async getApplication() {
            await restApi.get(`/marketing/attachment/not_created/${this.selectedPartner.blogger_offer_id}/`).then(async (res) => {
                this.document.id = res.data[0].id_;
                this.attachmentCreated = true;
                await restApi.get(`/marketing/attachment_row/${res.data[0].id_}/`).then(rows => {
                    this.document.rows = rows.data;
                    this.document.rows.forEach((el) => {
                        const date = new Date(el.date_of_publication)
                        const year = date.getFullYear()
                        const month = date.getMonth()+1
                        const day = date.getDate()
                        const lessThan10 = x => x < 10 ? '0' : ''
                        el.date_of_publication = `${year}-${lessThan10(month)}${month}-${lessThan10(day)}${day}`
                    });
                })
            })
        },
        async createPublications() {
            this.publication_files.forEach((el) => {
                const form = new FormData()
                form.append('file_object', el);
                formApi.post('/aws/blogger_offer/', form).then(async (res) => {
                    const doc = {
                        blogger_id: this.selectedPartner.blogger_offer_id,
                        aws_id: res.data.key,
                        document_type: "Публикация",
                        document_status: "Получено",
                        attachment_file_id: this.act.offer_attachment_file_id
                    }
                    await restApi.post('/marketing/blogger_file/', doc)
                })
            });
        },
        async getCreatedApplications() {
            restApi.get(`/marketing/attachment/created/${this.selectedPartner.blogger_offer_id}/`).then(res => {
                this.createdAttachments = res.data;
                this.createdAttachments.forEach((el) => {
                    el.document_name = `Приложение ${el.document_number}`
                });
            })
        },
        async sendAct() {
            await restApi.post('/marketing/certificate/', this.act).then(async (res) => {
                const mail = {
                    msg_subj: "Документы Integraaal",
                    msg_email: this.document.email,
                    msg_text: "Документы необходимо подписать и прислать ответным письмом на эту почту.",
                    attachments: [],
                    comment: ""
                }
                mail.attachments = res.data.aws_id;
                await restApi.post('/email/', mail).then(res =>  {
                    this.publicationsCreated = !this.publicationsCreated
                    this.closeDocDialog()
                });
            })
        },
        setPlace(value: string, row) {
            const index = this.document.rows.indexOf(row);
            this.document.rows[index] = {
                advertisement_characteristic: "",
                date_of_publication: "",
                advertisement_link: "",
                period_of_distribution: "",
                period_measurement: "",
                price: 0,
                base_attachment_id: this.document.rows[index].base_attachment_id ? this.document.rows[index].base_attachment_id : "",
                advertisement_place: value,
                account: "",
                participation: "",
                timer: "",
                id_: this.document.rows[index].id_ ? this.document.rows[index].id_ : ""
            }
        },
        deleteRow(row) {
            const index = this.document.rows.indexOf(row);
            this.document.rows.splice(index, 1);
        }
    },
    getters: {
        getSummaryPrice: (state) => {
            return state.document.rows.reduce((currentValue, sum) => sum.price + currentValue, 0 )
        },
        applications: (state) => {
            return state.createdAttachments.map(el => `Приложение ${el.document_number}`)
        }
    }
})