<!-- Tham khảo thêm: https://github.com/boindil/vue-file-agent-next/blob/main/packages/vue-file-agent-next/src/demo/demo-advanced.vue -->
<template>
  <VueFileAgent
    ref="vueFileAgent"
    :theme="'list'"
    :multiple="props.multiple"
    :deletable="true"
    :auto="true"
    :max-size="'50MB'"
    :max-files="props.maxFiles"
    :helpText="'Click vào đây để chọn tệp cần tải lên'"
    :accept="accept"
    :errorText="{
      type: 'Loại file không được hỗ trợ',
      size: 'Kích thước file tải lên quá lớn, vượt giới hạn 50MB',
    }"
    @beforedelete="onBeforeDelete($event)"
    @select="onFilesSelected($event)"
    v-model="data.fileRecords"
    @upload:error="uploadEvent('upload:error', $event)"
  />
  <v-card-actions>
    <v-btn color="primary" @click="uploadFiles">Tiến hành tải lên</v-btn>
    <v-btn v-if="dismissButton" color="success" @click="emit('upload:done', data.filesUploaded)">Hoàn thành</v-btn>
  </v-card-actions>
</template>
<script setup>
import httpClient, { MEDIA_SERVER } from '@/apis/httpClient';
import { ref, reactive } from 'vue';

const emit = defineEmits(['media-picker-upload-done', 'upload:done']);

const data = reactive({
  fileRecords: [],
  fileRecordsForUpload: [], // maintain an upload queue
  uploadUrl: `${httpClient.defaults.baseURL}/files`,
  uploadHeaders: { Authorization: `Bearer ${localStorage.getItem('accessToken')|| ''}` },
  filesUploaded: []
});
const vueFileAgent = ref(null);

// config ui
const props = defineProps({
  dismissButton: Boolean,
  multiple: {type: Boolean, default: false},
  maxFiles: {type: Number, default: 10},
  accept: {type: String, default: 'image/*'} // Danh sách mimeType hỗ trợ: image/*,video/*,.pdf,.doc,.docx,.ods
})

async function uploadFiles() {
  console.log(vueFileAgent);
  console.log("UploadFiles")
  vueFileAgent.value.upload(data.uploadUrl, data.uploadHeaders, data.fileRecordsForUpload, function createFormData(fileData){
    var formData = new FormData();
    formData.append('files', fileData.file); // this is important! - the actual file for upload
    formData.append('audit', {
      "useraction": "admin",
      "clientip": "10.23.29.6",
      "deviceinfo": ""
    })
    return formData; // edit: fixed. Thanks to Chauhan-Nitesh for the comment below
  }).then(response => {
    data.filesUploaded = response.map(item => {
      let {data: {data}} = item;
      // const [file] = data;
      // emit event đã upload xong để parent component cập nhật kết quả
      console.log(data);
      data = data.map(file => ({...file, fileurl: `${MEDIA_SERVER}/${file.fileurl}`}));
      emit('media-picker-upload-done', data)
      return data;
    })
  }).catch(e => {
    console.log(e)
  });
}

function onBeforeDelete(fileRecord) {
  console.log(fileRecord)
  var i = data.fileRecordsForUpload.indexOf(fileRecord);
  if (i !== -1) {
  // queued file, not yet uploaded. Just remove from the arrays
  data.fileRecordsForUpload.splice(i, 1);
  var k = data.fileRecords.indexOf(fileRecord);
  if (k !== -1) data.fileRecords.splice(k, 1);
  } else {
    vueFileAgent.value.deleteFileRecord(fileRecord); // will trigger 'delete' event
  }
}

function onFilesSelected(fileRecordsNewlySelected) {
  console.log(fileRecordsNewlySelected)
  const validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
  data.fileRecordsForUpload = data.fileRecordsForUpload.concat(validFileRecords);
}

function uploadEvent(eventName, data) {
  console.log('UPLOAD EVENT ', eventName, data)
}
</script>