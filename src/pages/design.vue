<template>
    <div class="design-container">
        <h2>Компоненты</h2>
        <div class="design-element">
            <v-btn class="button">Primary</v-btn>
        </div>
        <div class="design-element">
            <v-btn class="button button-disabled" :disabled="true">Primary</v-btn>
        </div>
        <div class="design-element">
            <v-btn class="button-secondary">Secondary</v-btn>
        </div>
        <div class="design-element">
            <v-btn class="button-secondary button-disabled" :disabled=true>Secondary</v-btn>
        </div>
        <div class="design-element">
            <v-btn class="button button-icon" icon="mdi-cog"></v-btn>
        </div>
        <div class="design-element">
            <v-text-field placeholder="test input" density="compact" variant="outlined"></v-text-field>
        </div>
        <div class="design-element">
            <v-textarea 
                rows="3" auto-grow row-height="25" placeholder="test text area" label="Label" density="compact" variant="outlined"></v-textarea>
        </div>
        <div class="design-element">
            <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined"></v-text-field>
        </div>
        <div class="design-element">
            <v-select 
                :items="['brand1', 'brand2', 'brand3']" placeholder="Multi select" density="compact" variant="outlined"></v-select>
        </div>
        <div class="design-element">
            <v-combobox 
                :items="['NEbrand1', 'TObrand2', 'brand3']" placeholder="Multi select with search" density="compact" variant="outlined"></v-combobox>
        </div>
        <div class="design-element">
            <v-date-input 
                prepend-icon="" prepend-inner-icon="$calendar" label="Date test input" placeholder="дд.мм.гггг" density="compact" variant="outlined"></v-date-input>
        </div>
    </div>
    <div class="design-container">
        <h2>Иконки</h2>
        <div class="design-element">
            <v-icon icon="custom:logout"></v-icon>
            <v-icon icon="custom:home"></v-icon>
            <v-icon icon="custom:folder"></v-icon>
            <v-icon icon="custom:search"></v-icon>
            <v-icon icon="custom:doc"></v-icon>
            <v-icon icon="custom:setting"></v-icon>
            <v-icon icon="custom:people"></v-icon>
            <v-icon icon="custom:arrow-down-circle"></v-icon>
            <v-icon icon="custom:bell"></v-icon>
            <v-icon color="red" icon="custom:flag"></v-icon>
            <v-icon color="yellow" icon="custom:flag"></v-icon>
            <v-icon color="green" icon="custom:flag"></v-icon>
        </div>        
    </div>
</template>
<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'

definePage({
    meta: {
        icon: 'mdi-home',
        title: 'Design',
        drawerIndex: 0,
    },
})
</script>
<style lang="scss">
.design {
    &-container {
        padding-left: 24px; 
        border-bottom: 2px #000 solid;
        max-width: 660px;
    }
    &-element {
        max-width: 360px;
        margin-bottom: 12px;
    }
}
</style>
