<template>
    <div>
        <v-text-field 
            v-model="modelValue"
            :disabled="props.disabled" 
            :placeholder="props.placeholder"
            :label="props.label"
            :density="props.density"
            :clearable="props.clearable"
            :min="props.min"
            :max="props.max"
            :type="props.type"
            variant="outlined"
            @keydown.enter="testing('tetete')">
        </v-text-field>
    </div>
</template>

<script setup>
const emit = defineEmits(["update"]);
const props = defineProps({
    model: {
        type: String,
        required: false,
        default: () => '',
    },
    disabled: {
        type: Boolean,
        required: false,
        default: () => false,
    },
    placeholder: {
        type: String,
        required: false,
        default: () => 'Введите значение'
    },
    label: {
        type: String,
        required: false,
        default: () => ''
    },
    density: {
        type: String,
        required: false,
        default: () => 'compact'
    },
    clearable: {
        type: Boolean,
        required: false,
        default: () => true,
    },
    type: {
        type: String,
        required: false,
        default: () => 'text'
    },
    min: {
        type: String,
        required: false,
        default: () => '',
    },
    max: {
        type: String,
        required: false,
        default: () => '',
    },
});

const modelValue = computed({
    get() {
        return props.model;
    },
    set(value) {
        emit('update', value);
    }
})
</script>