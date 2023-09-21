<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới album ảnh" width="1000" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="bodyNewCategory.newscategoryname"
              outlined
              label="Tên album ảnh"
              placeholder="Nhập tên album ảnh"
              variant="outlined"
              type="input"
              :rules="validator.newsCategoryName"
              hint="Nhập tên ảnh">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="data.selectNewCategoryId"
              variant="outlined"
              label="Album cha"
              :items="newCategories"
              item-title="label"
              item-value="value"
              class="ml-lg-3"
              return-object
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-btn class="mb-3" variant="outlined" color="primary" @click="()=>{imageUploadDialogState=true}"><v-icon left>mdi-image</v-icon> Chọn ảnh</v-btn>
          <ImagePicker 
            v-model:isShow="imageUploadDialogState" 
            :multiple="true"
            v-on:image-picker-upload-done="updateImageDone"/>
        </v-row>
      </v-form>
      <Gallery 
        v-model:images="images"
        :isRemove="true"
        v-on:removeImage="removeImage"/>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import {reactive, ref, onUpdated} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import ImagePicker from '@/components/ImagePicker.vue'
  import Gallery from '@/components/ImageGallery.vue';
  import {getTreeNewsCategories, createNewsCategories } from '@/apis/modules/newscategories.api';
  import { createAlbumMulti } from '@/apis/modules/albums.api';
  import { useAppStore } from '@/store/app.store';
  import { NEW_CATEGORY_TYPE, STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const initialNewCategory = {
    newscategoryname: "", 
    newscategorytype: "", 
    parentid: null,
    status: STATUS_ACTIVED
  }
  const bodyNewCategory = reactive({...initialNewCategory});

  const initialAlbum = {
    categoryid: "", 
    images: [], 
    status: STATUS_ACTIVED
  }
  const bodyAlbum = reactive({...initialAlbum});

  
  const data = reactive({
    selectNewCategoryId: { label: '--Không chọn--', value: "" },
    imageType : "1"
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
    newsCategoryName : [value => !!value || 'Không được để trống thông tin',],
  })
  

  onUpdated(async () => {
    let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.ALBUM,1);
    newCategories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.newscategoryname,
        value: category._id
      }
    });
  })

  function updateImageDone(data) {
    // console.log("updateImageDone")
     console.log(data)
    data.map(image=>{
      images.value.push(image)
    })
    //images.value = data || [];
    //console.log(images.value)
    // const [file] = data;
    // body.fileid = file?._id;
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
        bodyNewCategory.parentid = data.selectNewCategoryId?.value
        bodyNewCategory.newscategorytype = NEW_CATEGORY_TYPE.ALBUM
        console.log("save")
        console.log(bodyNewCategory)
        let res = await createNewsCategories(bodyNewCategory);
        if (res.error == "0"){
          //showSuccessAlert(res.message)
          bodyAlbum.categoryid = res.data._id
          bodyAlbum.images = images.value.map(image=>{
            return{
              imagename: image.originalname,
              description: "",
              fileid: image._id
            }
          })
          console.log("bodyAlbum")
          console.log(bodyAlbum)

          let resMulti = await createAlbumMulti(bodyAlbum);
          console.log(resMulti)
          //resetForm()
          //close dialog
          emit('update:isShow', false)
          emit('done');
        }
        else
          showErrorAlert(res.message)

        // console.log("bodyAlbum")
        // bodyAlbum.categoryid = "xxxx"
        // bodyAlbum.images = images.value.map(image=>{
        //   return{
        //     imagename: image.originalname,
        //     description: "",
        //     fileid: image._id
        //   }
        // })
        // console.log(bodyAlbum)

        //save
        // let res = await createAlbum(body);
        // if (res.error == "0"){
        //   showSuccessAlert(res.message)
        //   resetForm()
        //   //close dialog
        //   emit('update:isShow', false)
        //   emit('done');
        // }
        // else
        //   showErrorAlert(res.message)
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
    Object.assign(bodyNewCategory, initialNewCategory);
    Object.assign(bodyAlbum, initialAlbum);
    images.value=[];
  }
</script>

