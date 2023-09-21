<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới loại danh mục" width="900" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
            <v-text-field
              v-model="body.categoryname"
              outlined
              label="Tên loại danh mục"
              placeholder="Nhập loại danh mục"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập tên loại danh mục"
              :rules="validator.categoryName">
            </v-text-field>
      </v-form>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import {reactive, ref} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import { createCategory } from '@/apis/modules/category.api';
  import { useAppStore } from '@/store/app.store';
  import { STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    categoryname: "", 
    status: STATUS_ACTIVED
  });

  const form = ref(null);
  const loading = ref(false);
  const isValid = ref(false);
  const validator =  ref({
    categoryName : [
    value => !!value || 'Không được để trống thông tin',
    ]})

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        //save
        let res = await createCategory(body);
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