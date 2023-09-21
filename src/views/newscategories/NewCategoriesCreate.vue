<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới chuyên mục" width="900" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="12">
            <v-text-field
              v-model="body.newscategoryname"
              outlined
              label="Tên chuyên mục"
              placeholder="Nhập chuyên mục"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập tên chuyên mục"
              class="mb-5"
              :rules="validator.newsCategoryName">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-select
              v-model="data.selectNewCategoryType"
              @update:modelValue="changeNewCategoryType"
              variant="outlined"
              label="Loại chuyên mục"
              :items="newsCategoryTypes"
              item-title="label"
              item-value="value"
              class="mr-lg-3"
              return-object
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="data.parentId"
              clearable
              variant="outlined"
              label="Chuyên mục cha"
              :items="newsCategories"
              item-title="label"
              item-value="value"
              return-object
            />
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
  import { createNewsCategories, getNewsCategories, getTreeNewsCategories } from '@/apis/modules/newscategories.api';
  import { getNewsCategoryType } from '@/apis/modules/fixeddata.api';
  import { useAppStore } from '@/store/app.store';
  import { STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    newscategoryname: "", 
    newscategorytype: "",
    parentid: "",
    status: STATUS_ACTIVED
  });
  
  const data = reactive({
    selectNewCategoryType: { label: '--Không chọn--', value: "" },
    parentId: { label: '--Không chọn--', value: "" },
  })

  const form = ref(null);
  const loading = ref(false);
  const newsCategories = ref([])
  const newsCategoryTypes = ref([])
  const isValid = ref(false);
  const validator =  ref({
    newsCategoryName : [
    value => !!value || 'Không được để trống thông tin',
    ]})

  onUpdated(async () => {
    let resCategoryType = await getNewsCategoryType()
    newsCategoryTypes.value = resCategoryType.data;
  })

  function changeNewCategoryType() {
    getNewsCategory(data.selectNewCategoryType?.value);
  }

  async function getNewsCategory(categoryType){
    let resCategories = null;
    if(!categoryType){
      resCategories = await getNewsCategories(STATUS_ACTIVED)
    }else{
      resCategories = await getTreeNewsCategories(STATUS_ACTIVED,categoryType,1)
    }
        
    newsCategories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.newscategoryname,
        value: category._id
      }
    });
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        body.newscategorytype = data?.selectNewCategoryType?.value
        body.parentid = data?.parentId?.value

        //save
        let res = await createNewsCategories(body);
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