<template>
  <my-dialog 
    v-model="props.isShow" title="Cập nhật ảnh" width="1000" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="body.imagename"
              outlined
              label="Tên ảnh"
              placeholder="Nhập tên ảnh"
              variant="outlined"
              type="input"
              :rules="validator.imageName"
              hint="Nhập tên ảnh">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="data.selectNewCategoryId"
              variant="outlined"
              label="Album"
              :items="newCategories"
              item-title="label"
              item-value="value"
              class="ml-lg-3"
              return-object
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="body.description"
              outlined
              label="Mô tả image"
              placeholder="Nhập mô tả image"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập mô tả image"
              :rules="validator.description">
            </v-text-field>
          </v-col>
        </v-row>
        <v-switch label="Hoạt động" class="ml-lg-3" color="primary" inset v-model="data.switchStatus" hide-details></v-switch>
        <v-row no-gutters>
          <v-btn class="mt-3" variant="outlined" color="primary" @click="()=>{imageUploadDialogState=true}"><v-icon left>mdi-image</v-icon> Chọn ảnh</v-btn>
          <ImagePicker 
            v-model:isShow="imageUploadDialogState" 
            :multiple="false"
            v-on:image-picker-upload-done="updateImageDone"/>
        </v-row>
      </v-form>
      <Gallery 
        v-model:images="images"
        :isRemove="false"
        v-on:removeImage="removeImage"/>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import { MEDIA_SERVER } from '@/apis/httpClient';
  import {reactive, ref, onUpdated, watch} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import ImagePicker from '@/components/ImagePicker.vue'
  import Gallery from '@/components/ImageGallery.vue';
  import {getTreeNewsCategories } from '@/apis/modules/newscategories.api';
  import { updateAlbum } from '@/apis/modules/albums.api';
  import { useAppStore } from '@/store/app.store';
  import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
    data: Object
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    imagename: "", 
    description: "", 
    fileid: "",
    fileidolder: "",
    categoryid: "",
    status: STATUS_ACTIVED
  });
  
  const data = reactive({
    selectNewCategoryId: { label: '--Không chọn--', value: "" },
    switchStatus : false
  })

  const images = ref([]);

  const imageUploadDialogState = ref(false);
  const avatarSrc = ref(undefined);

  const form = ref(null);
  const loading = ref(false);
  const items = ref([])
  const newCategories = ref([])
  const isValid = ref(false);
  const validator =  ref({
    imageName : [value => !!value || 'Không được để trống thông tin',],
  })
  
  watch(() => props.data, (selection, prevSelection) => {
     Object.assign(body,{...props.data});
  });
  

  onUpdated(async () => {
    let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.ALBUM,1);
    newCategories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.newscategoryname,
        value: category._id
      }
    });

    data.selectNewCategoryId = newCategories.value.find(o=> o.value == body?.categoryid) || { label: '--Không chọn--', value: "" }
    data.switchStatus = body?.status == STATUS_ACTIVED ? true : false 

    images.value = body?.imagefile.map(image=>{
      return{
        ...image,
        fileurl: `${MEDIA_SERVER}/${image?.fileurl}`
      }
    });
    const [image] = body?.imagefile || [];
    body.fileid = image ? `${image?._id}` : "";
    body.fileidolder = image ? `${image?._id}` : "";
    console.log(body)
  })

  function updateImageDone(data) {
    // console.log("updateImageDone")
     console.log(data)
    // data.map(image=>{
    //   images.value.push(image)
    // })
    images.value = data || [];
    //console.log(images.value)
    const [file] = data;
    body.fileid = file?._id;
    //Nếu không nhập tên ảnh=>lấy tên file làm tên ảnh
    body.imagename = body.imagename.trim() == "" ? file?.originalname : body.imagename.trim();
  }
  function removeImage(image){
    let index = images.value.findIndex(x=>x._id == image._id)
    if (index>=0){
      images.value.splice(index,1)
    }
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        body.categoryid = data.selectNewCategoryId?.value
        body.fileidolder = body.fileid != body.fileidolder ? body.fileidolder : ""
        body.status = data?.switchStatus ? STATUS_ACTIVED : STATUS_DISABLED
        //save
        let res = await updateAlbum(body);
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

