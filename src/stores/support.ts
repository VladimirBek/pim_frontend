import { defineStore } from 'pinia';
import { restApi } from '@/restApi/restMethods.vue';

export const supportStore = defineStore('support', {
    state: () => {
        return {
            questions: [],
            feedbacks: [],
            selectedFeedback: {},
            selectedQuestion: {},
            answer: {
                marketplace: "WB",
                answer_text: ""
            }
        }
    },
    actions: {
        async getFeedbacks() {
            await restApi.get('/support/wb_feedback/').then((res) => this.feedbacks = res.data)
        },
        async getQuestions() {
            await restApi.get('/support/wb_question/').then((res) => this.questions = res.data)
        },
        selectFeedback(id) {
            this.selectedFeedback = this.feedbacks.find(el => el.id_ === id)
        },
        selectQuestion(id) {
            this.selectedQuestion = this.questions.find(el => el.id_ === id)
        },
        async sendAnswer(value) {
            let api = "";
            let answer = this.answer;
            if (value === 'feedback') {
                api = 'answer_feedbacks';
                answer.feedback_id = this.selectedFeedback.id_;
            } else {
                api = 'answer_questions';
                answer.question_id = this.selectedQuestion.id_;
            }
            await restApi.post(`/support/answer/${api}/`, answer).then(async (res) => {
                if (value === 'feedback') {
                    this.selectedFeedback = {}
                    this.answer = {
                        marketplace: 'WB',
                        answer_text: ''
                    }
                    await this.getFeedbacks();
                } else {
                    this.selectedQuestion = {}
                    await this.getQuestions();
                    this.answer = {
                        marketplace: 'WB',
                        answer_text: ''
                    }
                }
            }
            );
        }
    },
    getters: {
    }
})
