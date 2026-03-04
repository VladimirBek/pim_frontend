<template>
    <v-select 
        :value="model" 
        :label="label" 
        :items="items"
        :placeholder="placeholder"
        :clearable="clearable"
        item-title="name" 
        variant="outlined"  
        density="compact"></v-select>
</template>
<script setup>
const props = defineProps({
    model: {
        type: Object,
        required: false,
        default: () => {}
    },
    label: {
        type: String,
        required: false,
        default: () => ''
    },
    items: {
        type: Array,
        required: false,
        default: () => []
    },
    placeholder: {
        type: String,
        required: false,
        default: () => 'Выберите значение'
    },
    clearable: {
        type: Boolean,
        required: false,
        default: () => false
    }
})
</script>
<style lang="scss">
    
</style>