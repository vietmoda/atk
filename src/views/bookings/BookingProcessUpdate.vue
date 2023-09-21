<template>
  <my-dialog 
    v-model="props.isShow" title="Cập nhật trạng thái xử lý" width="700" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="12">
            <v-select
              v-model="data.selectBookingProcessStatus"
              variant="outlined"
              label="Trạng thái"
              :items="bookingProcessStatus"
              item-title="label"
              item-value="value"
              return-object
            />
            <v-textarea 
              label="Nội dung xử lý"
              v-model="body.processinfo"
              placeholder="Nhập nội dung xử lý"
              variant="outlined"
              rows="2"
            >
            </v-textarea>
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
  import {reactive, ref, onUpdated, watch} from 'vue'
  import moment from 'moment'
  import MyDialog from '@/components/Dialog.vue';
  import { updateBookingProcess } from '@/apis/modules/bookings.api';
  import { useAppStore } from '@/store/app.store';
  import { PROCESS_STATUS, STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
    data: Object
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    processstatus: "",
    processinfo: "",
    status: STATUS_ACTIVED
  });

  const data = reactive({
    selectBookingProcessStatus: {
      label: "Đang xử lý",
      value: PROCESS_STATUS.PROCESSED
    },
  })

  const bookingProcessStatus = ref([
    {
      label: "Đang xử lý",
      value: PROCESS_STATUS.PROCESSED
    },
    {
      label: "Đã đến thăm",
      value: PROCESS_STATUS.VISITED
    }
  ])

  const form = ref(null);

  const isValid = ref(false);
  const validator =  ref({
    linkName : [value => !!value || 'Không được để trống thông tin',],
    linkUrl : [value => !!value || 'Không được để trống thông tin',]
  })

  watch(()=>props.data,() =>{
    Object.assign(body,{...props.data})
  })
  onUpdated(async () => {
    data.selectBookingProcessStatus = bookingProcessStatus.value.find(o=> o.value == body?.processstatus) || { label: 'Đang xử lý', value: PROCESS_STATUS.PROCESSED }
  })

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      try {
        body.processstatus = data.selectBookingProcessStatus?.value || null
        //save
        let res = await updateBookingProcess(body);
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
      }
    }
  }

</script>