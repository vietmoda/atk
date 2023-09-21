<template>
  <my-dialog title="Xác nhận tài khoản" width="500" 
    v-on:dismiss="emit('update:isShow', false)"
    v-model="props.isShow">
    <template #content>
      <p>Bạn có chắc chắn xóa tài khoản <span class="text-warning font-weight-bold">{{ props.user?.username || `Không rõ tài khoản` }}</span></p>
    </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="error" @click="deleteUser"><v-icon left>mdi-delete</v-icon> Xóa tài khoản</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
import MyDialog from '@/components/Dialog.vue';
import { useUserStore } from '@/store/user.store';
const { deleteUserAction } = useUserStore();
const props = defineProps({
  isShow: Boolean,
  user: Object
});
const emit = defineEmits(['update:isShow', 'done']);

async function deleteUser() {
  // make request delete a user base on userId
  await deleteUserAction(props.user?._id);
  emit('update:isShow', false);
  emit('done');
}

</script>