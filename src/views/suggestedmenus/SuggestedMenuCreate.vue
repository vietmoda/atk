<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới thực đơn" width="1200" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
         <v-card>
          <v-tabs
            v-model="tab"
            color="deep-purple-accent-4"
            
          >
            <v-tab value="tabInfo">Thông tin thực đơn</v-tab>
            <v-tab value="tabFood">Danh sách món ăn({{foods.length}})</v-tab>
            <v-tab value="tabImage">Hình ảnh minh họa({{images.length}})</v-tab>
          </v-tabs>
          <v-window v-model="tab"  class="pt-3 pl-3 pr-3">
            <v-window-item value="tabInfo" >
              <v-row no-gutters >
                <v-col cols="12" md="8" >
                  <v-text-field
                    v-model="body.menuname"
                    outlined
                    label="Tên thực đơn"
                    placeholder="Nhập tên thực đơn"
                    variant="outlined"
                    type="input"
                    :rules="validator.menuName"
                    hint="Nhập tên thực đơn">
                  </v-text-field>
                  <v-textarea 
                    label="Ghi chú"
                    v-model="body.note"
                    placeholder="Nhập ghi chú"
                    variant="outlined"
                    rows="1"
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="body.price"
                    outlined
                    label="Đơn giá"
                    placeholder="Nhập đơn giá"
                    variant="outlined"
                    type="input"
                    :rules="validator.price"
                    class="ml-3">
                  </v-text-field>
                  <v-text-field
                    v-model="body.numberdiners"
                    outlined
                    label="Số thực khách"
                    placeholder="Nhập số khách"
                    variant="outlined"
                    type="number"
                    class="ml-3">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item value="tabFood" >
              <v-row no-gutters>
                <v-col cols="12" md="12">
                    <v-btn class="mb-3" variant="outlined" color="warning" @click="addFood"><v-icon left>mdi-food</v-icon> Thêm món ăn</v-btn>
                </v-col>
              </v-row>
              <Food 
                v-model:foods="foods"
                :isRemove="true"
                v-on:removeFood="removeFood"/>
            </v-window-item>
            <v-window-item value="tabImage" >
              <v-row no-gutters>
                <v-btn class="mb-3" variant="outlined" color="warning" @click="()=>{imageUploadDialogState=true}"><v-icon left>mdi-image</v-icon> Thêm hình ảnh</v-btn>
                <ImagePicker 
                  v-model:isShow="imageUploadDialogState" 
                  :multiple="true"
                  v-on:image-picker-upload-done="updateImageDone"/>
              </v-row>
              <Gallery 
                v-model:images="images"
                :isRemove="true"
                v-on:removeImage="removeImage"/>
            </v-window-item>
          </v-window>
        </v-card>
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
  import ImagePicker from '@/components/ImagePicker.vue'
  import Food from '@/components/FoodEditor.vue'
  import Gallery from '@/components/ImageGallery.vue';
  import {createSuggestedMenu } from '@/apis/modules/suggestedmenus.api';
  import {deleteMultiFile } from '@/apis/modules/files.api';
  import { useAppStore } from '@/store/app.store';
  import { STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const tab = ref(null);
  const initialBody = {
    menuname: "", 
    numberdiners: null,
    price: "", 
    listfood: [], 
    note: "", 
    images: [], 
    status: STATUS_ACTIVED
  }

  const body = reactive({...initialBody});
  const images = ref([]);
  const imagesRemove = ref([]);
  const foods = ref([]);
  const imageUploadDialogState = ref(false);

  const form = ref(null);
  const loading = ref(false);
  const isValid = ref(false);
  const validator =  ref({
    menuName : [value => !!value || 'Không được để trống tên thực đơn',],
    price : [value => !!value || 'Không được để trống đơn giá',],
  })
  
  function updateImageDone(data) {
    data.map(image=>{
      images.value.push(image)
    })
  }
  function removeImage(image){
    let index = images.value.findIndex(x=>x._id == image._id)
    if (index>=0){
      //Thêm id file xóa vào mảng để khi lưu call api xóa file vật lý
      imagesRemove.value.push(images.value[index]._id)

      images.value.splice(index,1)
    }
  }

  function removeFood(index){
    foods.value.splice(index,1)
  }
  function addFood(){
    foods.value.push("");
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      try {
        body.images = images.value.map(image=>image._id)
        body.listfood = foods.value

        //Xóa ảnh đính kèm nếu có
        if(imagesRemove.value.length != 0){
            deleteMultiFile(imagesRemove.value);
        }

        let res = await createSuggestedMenu(body);
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
      }
    }else{
      tab.value="tabInfo"
    }
  }

  function resetForm() {
    Object.assign(body, initialBody);
    images.value=[];
    imagesRemove.value = [];
    foods.value=[];
  }
</script>

