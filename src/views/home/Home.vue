<template>
  <v-row>
    <v-col cols="12" md="4">
      <Congratulation></Congratulation>
    </v-col>
    <v-col cols="12" md="4"><Congratulation></Congratulation></v-col>
    <v-col cols="12" md="4"><Congratulation></Congratulation></v-col>
  </v-row>
</template>

<script setup>
import Congratulation from './components/Congratulation.vue';
import { useAppStore } from '@/store/app.store';
import { storeToRefs } from 'pinia';

const {showWaringAlert, showLoadingAction } = useAppStore();
const { hasNotification } = storeToRefs(useAppStore());

function showAlert () {
  showWaringAlert("Toast contents. It can either be a string, a Vue Component, a JSX template or an Object. The shape of the object and its properties are described");
}




</script>



