<template>
  <my-dialog 
    v-model="props.isShow" title="Cập nhật danh mục chi tiết" width="900" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="12">
            <v-text-field
              v-model="body.itemname"
              outlined
              label="Tên danh mục chi tiết"
              placeholder="Nhập danh mục chi tiết"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập tên danh mục chi tiết"
              :rules="validator.itemName">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-select
              v-model="drop.selectCategoryId"
              @update:modelValue="changeCategory"
              variant="outlined"
              label="Loại danh mục"
              :items="categories"
              item-title="label"
              item-value="value"
              class="mr-lg-3"
              return-object
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="drop.selectParentId"
              clearable
              variant="outlined"
              label="danh mục chi tiết cha"
              :items="items"
              item-title="label"
              item-value="value"
              return-object
            />
          </v-col>
        </v-row>
         <v-switch label="Hoạt động" color="primary" inset v-model="drop.switchStatus" hide-details></v-switch>
      </v-form>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import {reactive, ref, onUpdated, watch} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import { updateItem, getItems, getItemByCategoryId } from '@/apis/modules/items.api';
  import { getCategories } from '@/apis/modules/category.api';
  import { useAppStore } from '@/store/app.store';
  import { STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
    data: Object
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    itemname: "", 
    categoryid: "",
    parentid: "",
    status: STATUS_ACTIVED
  });
  
  const drop = reactive({
    selectCategoryId: { label: '--Không chọn--', value: "" },
    selectParentId: { label: '--Không chọn--', value: "" },
    switchStatus : false
  })

  const form = ref(null);
  const loading = ref(false);
  const items = ref([])
  const categories = ref([])
  const isValid = ref(false);
  const validator =  ref({
    itemName : [
    value => !!value || 'Không được để trống thông tin',
    ]})

  watch(() => props.data, (selection, prevSelection) => {
     Object.assign(body,{...props.data});
  });

  onUpdated(async () => {
    let resCategories = await getCategories(1);
    categories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.categoryname,
        value: category._id
      }
    });
    await getItem(body?.categoryid);
    drop.selectCategoryId = categories.value.find(o=> o.value == body?.categoryid) || { label: '--Không chọn--', value: "" }
    drop.switchStatus = body?.status == 1 ? true : false
  })

  function changeCategory() {
    getItem(drop.selectCategoryId?.value);
  }

  async function getItem(categoryId){
    let resItems = null;
    if(categoryId==""){
      resItems = await getItems()
    }else{
      resItems = await getItemByCategoryId(categoryId)
    }
        
    items.value = resItems.data.map(item=>{
      return{
        ...item,
        label: item.itemname,
        value: item._id
      }
    });
    drop.selectParentId = items.value.find(o=> o.value == body?.parentid) || { label: '--Không chọn--', value: "" }
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        body.categoryid = drop?.selectCategoryId?.value
        body.parentid = drop?.selectParentId?.value
        body.status = drop?.switchStatus ? STATUS_ACTIVED : STATUS_DISABLED

        //save
        let res = await updateItem(body);
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