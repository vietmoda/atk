<template>
  <v-dialog
    v-model="props.isShow"
    persistent
    scrollable
    max-width="800"
    class="upload-container"
  >
    <v-card>
      <v-card-title> Tải lên</v-card-title>
      <v-card-text>
          <media-picker ref="refUploadDialog"
            v-bind:dismiss-button="true"
            v-bind:multiple="true"
            v-bind:accept="'image/*,video/*,.pdf,.doc,.docx,.ods'"
            @upload:done="finished"/>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script setup>
import MediaPicker from '@/components/MediaPicker.vue';

const props = defineProps({
  isShow: Boolean,
});
const emit = defineEmits(['update:isShow', 'upload:finished']);

function finished(data) {
  emit('upload:finished', data)
  emit('update:isShow', false)
}

</script>

<style lang="scss" scoped>
  .upload-container:deep(.v-card-actions)  {
    padding: 0 0;
  }
  .upload-container:deep(.v-card-actions .v-btn)  {
    padding: 0 0;
    margin: 10px;
  }
</style>