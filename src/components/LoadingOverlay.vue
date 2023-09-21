<template>
  <v-overlay v-model="isLoading" class="align-center justify-center" scroll-strategy="block">
    <!-- <div class="progress-container align-center justify-center">
      <v-progress-circular indeterminate :size="45" :width="6" color="white"></v-progress-circular>
    </div> -->
    <div class="dot-collision"></div>
  </v-overlay>
</template>

<script setup>
import { useAppStore } from '@/store/app.store';
import { storeToRefs } from 'pinia';

const { isLoading } = storeToRefs(useAppStore()) ;

</script>

<style lang="css" scoped>
/* style the overlay container as required */
.v-overlay--active {
    backdrop-filter: blur(2px);
    background: rgba(109, 109, 109, 0.2);;

}
.v-overlay--active:deep(div.v-overlay__scrim) {
  /* display: none !important; */
  background: transparent;
}
.progress-container {
  width: 120px;
  height: 120px;
  background: rgba(0,0,0,0.5);
  display: flex;
  border-radius: 15px;
}
</style>