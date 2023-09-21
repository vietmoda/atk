<template>
  <v-alert 
    v-if="hasNotification"
    variant="tonal"
    type="success"
    icon="$info"
    :text="notificationContent" 
    class="ma-3"
    closable
  >
  </v-alert>
</template>

<script setup>
import { storeToRefs} from 'pinia';
import { useAppStore } from '@/store/app.store';

const { hasNotification, notificationContent } = storeToRefs(useAppStore()) ;


</script>