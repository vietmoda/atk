<template>
  <div id="file-picker">
    <!-- <v-btn class="mt-3" :color="this.color" variant="outlined" @click="this.color"><v-icon left>mdi-content-save</v-icon> {{title_button}}</v-btn> -->
    <v-btn color="success" variant="elevated" @click="showUploadFileDialog()"><v-icon
        left>{{ icon }}</v-icon>{{ title_button }}</v-btn>

    <v-btn title="Bấm vào để xem chi tiết" color="success" variant="text" class="v-card-actions1" size="x-small"
      @click="() => { viewFileDiatate = true }">
      Đã tải lên {{ fileDataView?.length }} tệp tin
    </v-btn>

    <v-btn v-if="fileDataView?.length > 0" title="Bấm vào để xem chi tiết" color="success" size="small"
      @click="() => { viewFileDiatate = true }" type="line">Đã tải lên {{ fileDataView?.length }} tệp tin
    </v-btn>

    <v-dialog v-model="uploadFileDiatate" persistent scrollable :width="width || 600" class="pa-3">
      <v-card>
        <!-- Header Dialog -->
        <v-toolbar color="primary" :title="props.title_upload || 'Tải tệp tin'">
          <v-btn icon="mdi-close" dark @click="() => { uploadFileDiatate = false }"></v-btn>
        </v-toolbar>
        <!-- Body Dialog -->
        <v-card-text class="mb-2">
          <VueFileAgent ref="vueFileAgent" :theme="'list'" :multiple="props.multiple" :deletable="true" :maxSize="'50MB'"
            :maxFiles="10" :helpText="'Click vào đây để chọn file tải lên'" :accept="accept" :errorText="{
              type: 'Loại file không được hỗ trợ',
              size: 'Kích thước file tải lên quá lớn, vượt giới hạn 100 MB',
            }" @beforedelete="onBeforeDelete($event)" @select="filesSelected($event)" v-model="fileRecords" />
        </v-card-text>
        <!-- Footer Dialog -->
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" color="success" @click="uploadFiles()">Bắt đầu tải</v-btn>
          <v-btn variant="outlined" color="primary" :disabled="!showButtonUploadDone" class="ml-1"
            @click="uploadFileDone">Xong</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewFileDiatate" persistent scrollable :width="width || 800" class="pa-3">
      <v-card>
        <!-- Header Dialog -->
        <v-toolbar color="primary" :title="props.title_view || 'Xem tệp tin'">
          <v-btn icon="mdi-close" dark @click="() => { viewFileDiatate = false }"></v-btn>
        </v-toolbar>
        <!-- Body Dialog -->
        <v-card-text class="mb-2">
          <vue-good-table id="view-file-component" :columns="file_columns" :rows="fileDataView" :sort-options="{
            enabled: false
          }">
            <template #emptystate>
              Không có dữ liệu
            </template>
            <template #table-row="props">
              <div v-if="props.column.field === 'originalname'">
                <CLink :href="props.row.fileurl" target="_blank">
                  {{ props.row.originalname }}
                </CLink>
              </div>
              <div v-else-if="props.column.field === 'action'" class="center">
                <v-btn @click="deleteFile(props.row.originalIndex)" variant="outlined" size="x-small" color="error"
                  class="mx-1" icon="mdi-delete">
                  <v-icon color="error">mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="top">Xóa file đính kèm</v-tooltip>
                </v-btn>
              </div>
            </template>
          </vue-good-table>
        </v-card-text>
        <!-- Footer Dialog -->
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" color="danger" class="ml-1" @click="cancelViewFileDone">Đóng</v-btn>
          <v-btn variant="outlined" color="primary" class="ml-1" @click="viewFileDone">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
 
<script setup>
import httpClient, { MEDIA_SERVER } from '@/apis/httpClient';
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import MyDialog from '@/components/Dialog.vue';
import { useAppStore } from '@/store/app.store';
const { showErrorAlert } = useAppStore();

const file_columns = reactive([
  {
    label: 'Tên tệp tin',
    field: 'originalname',
    thClass: 'emu-vgt-thead-th text-center',
    tdClass: 'emu-vgt-tbody-td file-name',
  },
  {
    label: 'Xóa',
    field: 'action',
    thClass: 'text-center',
    tdClass: 'text-center',
    width: "60px"
  },
])

// config ui
const props = defineProps({
  file_data: "", //Mảng data file đầu vào
  title_upload: "", //Tiêu đề modal tải file
  title_view: "", //Tiêu đề modal xem file
  title_button: "", //Tiêu đề button tải file
  url_upload: "", //url api upload, không truyền sẽ lấy giá trị mặc định
  color_button: "", //màu buton, không truyền sẽ lấy giá trị mặc định (success)
  icon_button: "", //icon buton, không truyền sẽ lấy giá trị mặc định (upload)
  source_type: "", // Loại file
  dismissButton: Boolean,
  multiple: { type: Boolean, default: false },
  maxFiles: { type: Number, default: 10 },
  accept: { type: String, default: 'video/*' }, // Danh sách mimeType hỗ trợ: image/*,video/*,.pdf,.doc,.docx,.ods
})

const data = reactive({
  fileRecords: [],
  fileRecordsForUpload: [], // maintain an upload queue
  uploadUrl: `${httpClient.defaults.baseURL}/files`,
  uploadHeaders: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` },
  filesUploaded: []
});
const vueFileAgent = ref(null);

const emit = defineEmits(['update:isShow', 'done']);

const uploadFileDiatate = ref(false);
const viewFileDiatate = ref(false);
const showButtonUploadDone = ref(false);
const fileDataUpload = ref(null);
const fileDataView = ref([]);


function showUploadFileDialog() {
  uploadFileDiatate.value = true;
}

async function dismissDialog() {
  // reset validate form
  //await form.value.resetValidation();
  emit('update:isShow', false)
}

function sendData(data, change_file) {
  this.$emit('sendFiles', data),
    this.$emit('sendCheckChange', change_file)
}

async function uploadFiles() {
  let source_type = props.source_type || "";
  let primkey_id = props.primkey_id || "";
  vueFileAgent.value.upload(data.uploadUrl, data.uploadHeaders, data.fileRecordsForUpload, function createFormData(fileData) {
    var formData = new FormData();
    //formData.append('primkey_id', primkey_id);
    //formData.append('source_type',  source_type);
    formData.append('files', fileData.file); // this is important! - the actual file for upload
    formData.append('audit', {
      "useraction": "admin",
      "clientip": "10.23.29.6",
      "deviceinfo": ""
    })
    return formData; // edit: fixed. Thanks to Chauhan-Nitesh for the comment below
  }).then(response => {
    // this.fileIds = response.map(item => {
    //     return item.data.fileIds.join(',')
    // })
    console.log("uploadFiles");
    console.log(response);

    data.filesUploaded = response.map(item => {
      let { data: { data } } = item;
      // const [file] = data;
      // emit event đã upload xong để parent component cập nhật kết quả

      data = data.map(file => ({ ...file, fileurl: `${MEDIA_SERVER}/${file.fileurl}` }));
      //emit('media-picker-upload-done', data)
      fileDataView.value = data
      console.log("fileDataView")
      console.log(fileDataView)
    })
    // response.map(item => {
    //     this.file_data_new.push(item.data.fileDetails[0])
    // })
    showButtonUploadDone.value = true;

    //this.file_temp = JSON.parse(JSON.stringify(this.file_data_new));
  }).catch(e => {
    console.log(e)
  });
}
function uploadFileDone() {
  data.fileRecords = [];
  data.fileRecordsForUpload = [];
  showButtonUploadDone.value = false;
  //this.file_temp = JSON.parse(JSON.stringify(this.file_data_new));
  //this.sendData(this.file_temp,this.change_file);
  uploadFileDiatate.value = false;
}
function onBeforeDelete(fileRecord) {
  var i = this.fileRecordsForUpload.indexOf(fileRecord);
  if (i !== -1) {
    // queued file, not yet uploaded. Just remove from the arrays
    this.fileRecordsForUpload.splice(i, 1);
    var k = this.fileRecords.indexOf(fileRecord);
    if (k !== -1) this.fileRecords.splice(k, 1);
  } else {
    this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
  }
}
function filesSelected(fileRecordsNewlySelected) {
  console.log(fileRecordsNewlySelected)
  const validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
  data.fileRecordsForUpload = data.fileRecordsForUpload.concat(validFileRecords);
  console.log(data.fileRecordsForUpload)
  // var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
  // this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
}

</script>

<style lang="scss">
#file-picker {
  .v-card-actions1 {
    align-items: center;
    display: flex;
    flex: none;
    min-height: 52px;
    padding: 0 1rem;
  }
}

#view-file-component {
  table.vgt-table td {
    vertical-align: inherit;
    color: black !important;
    font-size: 14.5px;
    //padding: 0.3rem !important;
    padding: 0em .75em .0em .75em;
  }

  //   .vgt-responsive {
  //     overflow-x: inherit;
  //   }

  .file-name {
    width: calc(100% - 55px) !important;
  }
}

#upload-file-component {
  .vue-file-agent .file-progress.file-progress-done {
    width: calc(100% - 55px) !important;
    border-radius: 0;
  }

  .vue-file-agent.file-input-wrapper {
    min-height: 200px;
  }
}

.modal-header {
  padding: 0.5rem 0.5rem !important;
}
</style>