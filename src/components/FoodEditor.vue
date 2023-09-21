<template>
  <v-row >
    <v-col cols="12" md="12" class="food-editor"
      v-for="(food, index) in foods"
      :key="index">
      <v-text-field
        v-model="foods[index]"
        :append-icon="'mdi-delete'"
        variant="outlined"
        clear-icon="mdi-close-circle"
        label="Tên món ăn"
        type="text"
        @click:append="$emit('removeFood',index)"
      />
    </v-col>
  </v-row>
</template>

<script setup>
  import {defineProps} from 'vue'
  const props = defineProps({
    foods: Object
  })
  
</script>

<style scoped>
.food-editor{
  padding: 0px 12px 0px 12px;
}
</style>