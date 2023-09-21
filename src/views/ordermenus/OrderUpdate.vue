<template>
  <my-dialog 
    v-model="props.isShow" title="Cập nhật thông tin" width="1200" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form">
        <v-row no-gutters>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="body.fullname"
              outlined
              label="Tên khách hàng"
              placeholder="Nhập tên khách hàng"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập tên khách hàng"
              :rules="validator.fullname">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="body.totaldiners"
              outlined
              label="Tổng số người"
              placeholder="Nhập số lượng người"
              variant="outlined"
              type="number"
              clearable
              class = "ml-3"
              >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea 
              label="Địa chỉ"
              v-model="body.address"
              placeholder="Nhập địa chỉ"
              variant="outlined"
              rows="2"
            >
            </v-textarea>
          </v-col>
          <v-col cols="12" md="12">
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
              v-model="body.telephone"
              outlined
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập số điện thoại"
              >
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
          <v-col cols="12" md="3">
            <v-text-field
              v-model="data.visitdate"
              label="Ngày đặt bàn"
              placeholder="Nhập ngày đặt"
              variant="outlined"
              type="date"
              clearable
              class="ml-lg-3"
              :rules="validator.visitdate"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="data.visithour"
              label="Giờ đặt bàn"
              placeholder="Nhập giờ đặt"
              variant="outlined"
              type="time"
              clearable
              class="ml-lg-3"
              :rules="validator.visithour"
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
  import { updateOrderMenu } from '@/apis/modules/ordermenus.api';
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
    fullname: "", 
    address: "", 
    telephone: "",
    email: "",
    totaldiners: "",
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
    fullname : [value => !!value || 'Không được để trống tên khách hàng',],
    visitdate : [value => !!value || 'Không được để trống ngày',],
    visithour : [value => !!value || 'Không được để trống giờ',],
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
        let res = await updateOrderMenu(body);
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