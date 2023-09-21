<template>
  <my-dialog 
    v-model="props.isShow" title="Cập nhật tham số" width="900" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
            <v-text-field
              v-model="body.configkey"
              @input="body.configkey = body.configkey.toUpperCase()"
              outlined
              label="Mã tham số"
              variant="outlined"
              type="input"
              readonly>
            </v-text-field>
            <v-text-field
              v-model="body.configvalue"
              outlined
              label="Giá trị"
              placeholder="Nhập giá trị"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập giá trị"
              :rules="validator.configvalue">
            </v-text-field>
            <v-switch label="Hoạt động" color="primary" inset v-model="data.switchStatus" hide-details></v-switch>
      </v-form>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import {reactive, ref, watch, onUpdated} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import { updateSystemConfig} from '@/apis/modules/systemconfigs.api';
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
    configkey: "", 
    configvalue: "",
    status: STATUS_ACTIVED
  });

  const data = reactive({
    switchStatus : false
  })

  const form = ref(null);
  const loading = ref(false);
  const isValid = ref(false);
  const validator =  ref({
    configkey : [
      value => !!value || 'Không được để trống mã tham số',
      value => /^[a-zA-Z0-9_.]*$/.test(value) || 'Mã tham số không chứa khoảng trắng và ký tự đặc biệt',
    ],
    configvalue : [value => !!value || 'Không được để trống giá trị',]})

  watch(() => props.data, (selection, prevSelection) => {
     Object.assign(body,{...props.data});
  });

  onUpdated(async () => {
    data.switchStatus = body?.status == STATUS_ACTIVED ? true : false
  })

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        body.status = data?.switchStatus ? STATUS_ACTIVED : STATUS_DISABLED

        //save
        let res = await updateSystemConfig(body);
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