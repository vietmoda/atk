<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới liên kết" width="1000" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="10">
            <v-row no-gutters class="mb-3 mr-lg-3" >
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="body.linkname"
                  outlined
                  label="Tên liên kết"
                  placeholder="Nhập tên liên kết"
                  variant="outlined"
                  type="input"
                  clearable
                  hint="Nhập tên liên kết"
                  :rules="validator.linkName">
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
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="body.linkurl"
                  outlined
                  label="URL"
                  placeholder="Nhập url liên kết"
                  variant="outlined"
                  type="input"
                  clearable
                  hint="Nhập url liên kết"
                  :rules="validator.linkUrl">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="data.selectViewType"
                  variant="outlined"
                  label="Loại hiển thị"
                  :items="viewTypes"
                  item-title="label"
                  item-value="value"
                  class="ml-lg-3"
                  return-object
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="2">
            <div class="thumbnail">
              <v-img title="Click để chọn ảnh thumbnail" :src="avatarSrc || 'src/assets/images/no-image.png'" @click="()=>{thumbnailDialogState=true}"></v-img>
              <ThumbnailPicker v-model:is-show="thumbnailDialogState" :avatarSrc="avatarSrc" v-on:thumbnail-picker-upload-done="updateThumbnailDone"/>
            </div>
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
  import {getTreeNewsCategories } from '@/apis/modules/newscategories.api';
  import { createWebLink } from '@/apis/modules/weblinks.api';
  import { useAppStore } from '@/store/app.store';
  import { NEW_CATEGORY_TYPE, STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const initialBody = reactive({
    linkname: "", 
    linkurl: "", 
    viewtype: "",
    fileid: "",
    categoryid: "",
    status: STATUS_ACTIVED
  });
  const body = reactive({...initialBody});

  const data = reactive({
    selectNewCategoryId: { label: '--Không chọn--', value: "" },
    selectViewType: { label: 'Hiển thị tên', value: "Title" }
  })

  const thumbnailDialogState = ref(false);
  const avatarSrc = ref(undefined);

  const form = ref(null);
  const loading = ref(false);
  const items = ref([])
  const newCategories = ref([])
  const viewTypes = ref([
    {label: 'Hiển thị tên', value: "Title"},
    {label: 'Hiển thị ảnh', value: "Image"}
  ])

  const isValid = ref(false);
  const validator =  ref({
    linkName : [value => !!value || 'Không được để trống thông tin',],
    linkUrl : [value => !!value || 'Không được để trống thông tin',]
  })

  onUpdated(async () => {
    let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.WEBLINK,1);
    newCategories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.newscategoryname,
        value: category._id
      }
    });
  })

  function updateThumbnailDone(data) {
    const [file] = data;
    avatarSrc.value = file?.fileurl || 'src/assets/images/no-avatar.png';
    body.fileid = file?._id;
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        body.categoryid = data.selectNewCategoryId?.value
        body.viewtype = data.selectViewType?.value
        //save
        let res = await createWebLink(body);
        if (res.error == "0"){
          showSuccessAlert(res.message)
          resetForm();
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

  function resetForm() {
    Object.assign(body, initialBody);
  }

</script>