<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới video" width="1000" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="10">
            <v-row no-gutters class="mr-lg-3">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="body.videoname"
                  outlined
                  label="Tên video"
                  placeholder="Nhập tên video"
                  variant="outlined"
                  type="input"
                  clearable
                  hint="Nhập tên video"
                  :rules="validator.videoname">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="data.selectNewCategoryId"
                  variant="outlined"
                  label="Chuyên mục"
                  :items="newCategories"
                  item-title="label"
                  item-value="value"
                  class="ml-lg-3"
                  return-object
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mr-lg-3">
            <v-col cols="12" md="12">
              <v-text-field
                v-model="body.description"
                outlined
                label="Mô tả video"
                placeholder="Nhập mô tả video"
                variant="outlined"
                type="input"
                clearable
                hint="Nhập mô tả video"
                :rules="validator.description">
              </v-text-field>
            </v-col>
          </v-row>
          </v-col>
          <v-col cols="12" md="2">
            <div class="thumbnail">
              <v-img title="Click để chọn ảnh thumbnail" height="130" :src="avatarSrc || 'src/assets/images/no-image.png'" @click="()=>{thumbnailDialogState=true}"></v-img>
              <ThumbnailPicker v-model:is-show="thumbnailDialogState" :avatarSrc="avatarSrc" v-on:thumbnail-picker-upload-done="updateThumbnailDone"/>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-radio-group
                v-model="data.videoType"
                inline
              >
                <v-radio
                  color="primary"
                  label="Upload"
                  value="1"
                ></v-radio>
                <v-radio
                  color="primary"
                  label="Video Youtube"
                  value="2"
                ></v-radio>
              </v-radio-group>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="data.videoType==1">
          <VideoPicker v-on:video-picker-upload-done="updateVideoDone"/>
        </v-row>
        <v-row no-gutters v-if="data.videoType==2">
          <v-col cols="12" md="12">
            <v-text-field
              v-model="body.videourl"
              outlined
              label="URL video"
              placeholder="Nhập url video"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập url video">
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import {reactive, ref, onUpdated} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import ThumbnailPicker from '@/components/ThumbnailPicker.vue'
  import VideoPicker from '@/components/VideoPicker.vue'
  import {getTreeNewsCategories } from '@/apis/modules/newscategories.api';
  import { createVideo } from '@/apis/modules/videos.api';
  import { useAppStore } from '@/store/app.store';
  import { NEW_CATEGORY_TYPE, STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    videoname: "", 
    description: "", 
    videoavatar: "",
    videourl: "",
    fileid: "",
    categoryid: "",
    status: STATUS_ACTIVED
  });
  
  const data = reactive({
    selectNewCategoryId: { label: '--Không chọn--', value: "" },
    videoType : "1"
  })

  const thumbnailDialogState = ref(false);
  const avatarSrc = ref(undefined);

  const form = ref(null);
  const loading = ref(false);
  const items = ref([])
  const newCategories = ref([])
  const isValid = ref(false);
  const validator =  ref({
    videoname : [value => !!value || 'Không được để trống thông tin',],
  })

  onUpdated(async () => {
    let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.VIDEO,1);
    newCategories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.newscategoryname,
        value: category._id
      }
    });
  })

  function updateThumbnailDone(data) {
    console.log("updateThumbnailDone")
    console.log(data)
    const [file] = data;
    avatarSrc.value = file?.fileurl || 'src/assets/images/no-avatar.png';
    body.videoavatar = file?._id;
  }

  function updateVideoDone(data) {
    console.log("updateVideoDone")
    console.log(data)
    
    const [file] = data;
    body.fileid = file?._id;
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        body.categoryid = data.selectNewCategoryId?.value
        body.fileid = data.videoType == 1 ? body.fileid : ""
        body.videourl = data.videoType == 2 ? body.videourl : ""
        //save
        let res = await createVideo(body);
        if (res.error == "0"){
          showSuccessAlert(res.message)
          //close dialog
          emit('update:isShow', false)
          emit('done');
        }
        else
          showErrorAlert(res.message)
      }
      catch (error) {
        const {message} = error;
        showErrorAlert(message)
      } finally {
        loading.value = false;
      }
    }
  }

</script>