<template>
  <my-dialog title="Xác nhận" width="500" 
    v-on:dismiss="emit('update:isShow', false)"
    v-model="props.isShow">
    <template #content>
      <p>Bạn có chắc chắn {{props.data?.status == 1 ? "khóa" : "mở khóa"}} nhóm quyền <br/><span class="text-warning font-weight-bold">{{ props.data?.groupname || `Không rõ nhóm quyền` }}</span></p>
    </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="onUpdateStatus"><v-icon left>mdi-content-save</v-icon> Đồng ý</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
import MyDialog from '@/components/Dialog.vue';
import { useUserStore } from '@/store/user.store';
import { updateStatus } from '@/apis/modules/grouproles.api';
import { useAppStore } from '@/store/app.store';
import { STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const props = defineProps({
  isShow: Boolean,
  data: Object
});
const emit = defineEmits(['update:isShow', 'done']);

async function onUpdateStatus() {
  try {
    let status = props.data?.status == STATUS_ACTIVED ? STATUS_DISABLED : STATUS_ACTIVED;
    let res = await updateStatus({
      "_id": props.data?._id, 
      "status": status,
    })
    if (res.error == "0"){
      showSuccessAlert(res.message)
      emit('update:isShow', false);
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

</script>