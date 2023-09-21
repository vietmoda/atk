<!-- Tham khảo thêm: https://github.com/boindil/vue-file-agent-next/blob/main/packages/vue-file-agent-next/src/demo/demo-advanced.vue -->
<template>
  <!-- <v-img title="Click để chọn ảnh video" width="110" height="110" :src="avatarSrc || 'src/assets/images/no-image.png'" @click="showUploadFileDialog"></v-img> -->
  <!-- <v-btn variant="outlined" color="primary" @click="showUploadFileDialog">Chọn video</v-btn> -->
  <!-- <div class="d-flex flex-row ml-3 w-100"> -->
    <!-- <v-img v-if="!data.videoUrl" cover width="220" height="140" src="src/assets/images/no-video.png"></v-img> -->
    <!-- <video width="220" height="140" controls>
      <source :src="videoSrc" type="video/mp4">
    </video> -->
    <div class="d-flex flex-column w-100">
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
        <v-btn v-if="totalFileUploadDone > 0"
          color="warning" 
          variant="text" 
           class="flex-grow-1"
          size="x-small"
        >
          (Đã tải lên {{totalFileUploadDone}} tệp tin)
        </v-btn>
      </v-card-actions>
    <!-- </div> -->
  </div>
</template>
<script setup>
import httpClient, { MEDIA_SERVER } from '@/apis/httpClient';
import { ref, reactive, watch } from 'vue';

const emit = defineEmits(['video-picker-upload-done', 'upload:done']);

const videoSrc = ref(null)
const totalFileUploadDone = ref(0);

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
  accept: {type: String, default: '.mp4'}, // Danh sách mimeType hỗ trợ: image/*,video/*,.pdf,.doc,.docx,.ods
  videoSrc: String
})

 watch(() => props.videoSrc, (selection, prevSelection) => {
    videoSrc.value = {...props.videoSrc};
    console.log("videoSrc: ")
    console.log(videoSrc)
  });

async function uploadFiles() {
  console.log(vueFileAgent);
  console.log("UploadFiles")
  totalFileUploadDone.value = 0;
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
    console.log("response")
    console.log(response)
    data.filesUploaded = response.map(item => {
      let {data: {data}} = item;
      // const [file] = data;
      // emit event đã upload xong để parent component cập nhật kết quả
      //console.log(data);
      data = data.map(file => ({...file, fileurl: `${MEDIA_SERVER}/${file.fileurl}`}));
      totalFileUploadDone.value = data.length;
      emit('video-picker-upload-done', data)
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

function showUploadFileDialog(){
  uploadFileDialogState.value = true;
}

// function uploadFileDone() {
//     data.fileRecords = [];
//     data.fileRecordsForUpload= [];
//     showButtonUploadDone.value=false;

//     //Hiển thị hình ảnh video khi Hoàn thành
//     const [file] = fileUploads.value;
//     avatarSrc.value = file?.fileurl || 'src/assets/images/no-image.png';

//     emit('video-picker-upload-done', fileUploads.value)
//     uploadFileDialogState.value = false;
// }


</script>