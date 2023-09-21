<template>
  <v-dialog v-model="props.isShow" persistent scrollable :width="width || 1024" class="pa-3">
    <v-card>
      <!-- Header Dialog -->
      <v-toolbar color="primary" :title="title || 'Không có tiêu đề'">
        <v-btn icon="mdi-close" dark @click="emit('dismiss', false)"></v-btn>
      </v-toolbar>
      <!-- Body Dialog -->
      <v-card-text class="mb-2">
        <slot name="content"/>
      </v-card-text>
      <!-- Footer Dialog -->
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn class="mt-3" variant="outlined" @click="emit('dismiss', false)"><v-icon left>mdi-close-circle</v-icon>Hủy bỏ</v-btn>
        <slot name="action"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  isShow: Boolean,
  title: String,
  width: String
});
const emit = defineEmits(['dismiss'])
</script>

<style lang="scss" scoped>
// local custom style here
</style>