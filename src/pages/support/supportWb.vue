<template>
    <v-card>
        <div>
            <v-tabs v-model="tab" color="regular" class="mb-2">
                <v-tab value="comments">Комментарии</v-tab>
                <v-tab value="questions">Вопросы</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item value="comments">
                    <FeedbacksList/>
                </v-window-item>
                <v-window-item value="questions">
                    <QuestionsList/>
                </v-window-item>
            </v-window>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { restApi } from '@/restApi/restMethods.vue';
import { supportStore } from '@/stores/support';

// definePage({
//     meta: {
//         title: "Поддержка ВБ",
//         icon: 'mdi-chat-alert-outline',
//         drawerIndex: 1,
//     },
// })

const store = supportStore();
const tab = ref('comments');


onMounted(async () => {
})

</script>

<style lang="scss">
.support {}
</style>