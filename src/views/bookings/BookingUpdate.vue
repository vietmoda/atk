<template>
  <my-dialog 
    v-model="props.isShow" title="Cập nhật thông tin" width="1200" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="body.visitername"
              outlined
              label="Tên khách hàng"
              placeholder="Nhập tên khách hàng"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập tên khách hàng"
              :rules="validator.linkName">
            </v-text-field>
            <v-textarea 
              label="Địa chỉ"
              v-model="body.address"
              placeholder="Nhập địa chỉ"
              variant="outlined"
              rows="2"
            >
            </v-textarea>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="body.leaderinfo"
              outlined
              label="Người đại diện"
              placeholder="Nhập người đại diện"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập người đại diện">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="body.telephone"
              outlined
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập số điện thoại"
              class="ml-lg-3">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="body.email"
              outlined
              label="Email"
              placeholder="Nhập email"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập email"
              class="ml-lg-3">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea 
              label="Nội dung"
              v-model="body.content"
              placeholder="Nhập nội dung"
              variant="outlined"
              rows="1"
            >
            </v-textarea>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="data.visitdate"
              label="Ngày đến"
              placeholder="Nhập ngày đến"
              variant="outlined"
              type="date"
              clearable
              class="ml-lg-3"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="data.visithour"
              label="Giờ đến"
              placeholder="Nhập giờ đến"
              variant="outlined"
              type="time"
              clearable
              class="ml-lg-3"
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
  import {reactive, ref, onUpdated, watch} from 'vue'
  import moment from 'moment'
  import MyDialog from '@/components/Dialog.vue';
  import { updateBooking } from '@/apis/modules/bookings.api';
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
    visitername: "", 
    address: "", 
    telephone: "",
    email: "",
    totalmember: "",
    leaderinfo: "",
    visitdate: "",
    visithour: "",
    content: "",
    processstatus: "",
    processinfo: "",
    status: STATUS_ACTIVED
  });

  const data = reactive({
      visitdate: null,
      visithour: null,
  })
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
    data.visitdate = body.visitdate ? moment(body.visitdate).format("YYYY-MM-DD") : null;
    data.visithour = body.visithour || null;
  })

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      try {
        body.visitdate = data.visitdate ? moment(data.visitdate, 'YYYY-MM-DD').format('DD/MM/YYYY') : null
        body.visithour = data.visithour
        //save
        let res = await updateBooking(body);
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