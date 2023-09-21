<template>
  <my-dialog title="Xác nhận" width="500" 
    v-on:dismiss="emit('update:isShow', false)"
    v-model="props.isShow">
    <template #content>
      <p>Bạn có chắc chắn xóa video <br/><span class="text-warning font-weight-bold">{{ props.data?.videoname || `Không rõ video` }}</span></p>
    </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="error" @click="onDelete"><v-icon left>mdi-delete</v-icon> Xóa</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
import MyDialog from '@/components/Dialog.vue';
import { useUserStore } from '@/store/user.store';
import { updateStatusVideo } from '@/apis/modules/videos.api';
import { useAppStore } from '@/store/app.store';
import { STATUS_DELETED } from '@/utils/constants';

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const props = defineProps({
  isShow: Boolean,
  data: Object
});
const emit = defineEmits(['update:isShow', 'done']);

async function onDelete() {
  try {
    let res = await updateStatusVideo({
      "_id": props.data?._id, 
      "status": STATUS_DELETED,
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