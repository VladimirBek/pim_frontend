<template>
    <v-combobox
    :v-model="model"
    :label="label"
    :placeholder="placeholder"
    :density="density"
    variant="outlined">

    </v-combobox>
</template>
<script setup lang="ts">
defineProps({
    model: {
        type: String,
        required: false,
        default: () => ''
    },
    label: {
        type: String,
        required: false,
        default: () => ''
    },
    placeholder: {
        type: String,
        required: false,
        default: () => ''
    },
    density: {
        type: String,
        required: false,
        default: () => 'comfortable' 
    },
})
</script>