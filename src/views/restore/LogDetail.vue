<template>
    <my-dialog title="thong tin chi tiet" width="500" v-on:dismiss="emit('update:isShow', false)" v-model="props.isShow">
        <template #content>

            <p class="text-warning font-weight-bold">
                {{ "thao tac: " + props.data.actiontype }}
            </p>
            <p class="text-warning font-weight-bold">
                {{ "bang thao tac: " + props.data.collectionname }}
            </p>
            <p class="text-warning font-weight-bold">
                {{ "nguoi thao tac: " + props.data.actionname }}
            </p>
            <p class="text-warning font-weight-bold">
                {{ "thoi gian truy xuat: " + props.data.updatedAt }}
            </p>

        </template>

    </my-dialog>
</template>

<script setup>
import MyDialog from '@/components/Dialog.vue';
// import { useUserStore } from '@/store/user.store';
// import { getLogs } from '@/apis/modules/logs.api';
import { useAppStore } from '@/store/app.store';
// import { STATUS_DELETED } from '@/utils/constants'
// import detailDialogState from './LogsManager.vue'

// const { showErrorAlert } = useAppStore();
// const { showSuccessAlert } = useAppStore();

const props = defineProps({
    isShow: Boolean,
    data: Object
});
const emit = defineEmits(['update:isShow', 'done']);

</script>