
<template>
    <v-card class="mb-5 card-search">
        <v-toolbar class="title mb-3" color="primary" title="Danh sách di tích lịch sử"></v-toolbar>
        <v-card-subtitle>Danh sách toàn bộ di tích trên hệ thống. Bạn có thể thêm mới, sửa, xóa và cập nhật di tích lịch
            sử</v-card-subtitle>
        <v-card-actions>
            <v-btn variant="outlined" size="small" color="primary" @click="createDialogState = true" class="mt-3">Thêm
                mới</v-btn>
        </v-card-actions>
    </v-card>

    <!-- Card content -->
    <v-card class="mx-auto mt-5">
        <vue-good-table ref="someTable" :columns="columns" :rows="historicalSites" :line-numbers="true" :loading="loading"
            :sort-options="{
                enabled: true
            }" :search-options="{
    enabled: true,
    placeholder: 'Nhập từ khóa để tìm kiếm',
}" :pagination-options="{
    enabled: true,
    perPageDropdownEnabled: false,
    nextLabel: 'Trang sau',
    prevLabel: 'Trang trước',
    ofLabel: 'của',
}">
            <template #emptystate>
                Không có dữ liệu
            </template>
            <template #table-row="props">
                <div v-if="props.column.field === 'status'" class="center">
                    <v-badge v-if="props.row.status == 1" content="Hoạt động" color="success" inline></v-badge>
                    <v-badge v-else content="Không hoạt động" color="warning" inline></v-badge>
                </div>
                <!-- <div v-else-if="props.column.field === 'images'" class="d-flex justify-center">
                    <img height="110" width="110" :title="props.row?.imagefile[0]?.originalname || 'Không có ảnh'"
                        :src="props.row?.imagefile[0]?.fileurl ? `${MEDIA_SERVER}/${props.row?.imagefile[0]?.fileurl}` : 'src/assets/images/no-image.png'">
                </div> -->
                <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
                    <v-btn @click="updateHistoricalSites(props.row)" v-bind="props" variant="outlined" size="x-small"
                        color="secondary" class="mx-1" icon="mdi-pencil">
                        <v-icon color="secondary">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="top">Sửa di tich</v-tooltip>
                    </v-btn>
                    <v-btn @click="deleteHistoricalSites(props.row)" variant="outlined" size="x-small" color="error"
                        class="mx-1" icon="mdi-delete">
                        <v-icon color="error">mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="top">Xóa di tich</v-tooltip>
                    </v-btn>
                </div>

            </template>
        </vue-good-table>
    </v-card>

    <HistoricalSitesCreate v-model:is-show="createDialogState" v-on:done="onSearch" />
    <HistoricalSitesUpdate v-model:is-show="updateDialogState" :data="userDataUpdate" v-on:done="onSearch" />
    <HistoricalSitesDelete v-model:is-show="deleteDialogState" :data="userDataDelete" v-on:done="onSearch" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import HistoricalSitesCreate from './HistoricalSitesCreate.vue';
import HistoricalSitesUpdate from './HistoricalSitesUpdate.vue';
import HistoricalSitesDelete from './HistoricalSitesDelete.vue';
import { getHistoricalSites } from '@/apis/modules/historicalsites.api';
import { useAppStore } from '@/store/app.store';
import { MEDIA_SERVER } from '@/apis/httpClient';

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const userDataUpdate = ref(null);
const userDataDelete = ref(null);

const columns = ref([
    {
        label: "Tên di tích lịch sử",
        field: "name",
        thClass: "text-center"
    },
    {
        label: "Mô tả",
        field: "introduce",
        width: '600px',
        thClass: "text-center"
    },
    {
        label: "Địa chỉ",
        field: "areadetail",
        width: '200px',
        thClass: "text-center"
    },
    {
        label: "Hình ảnh",
        field: "images",
        width: '120px',
        thClass: "text-center",
        tdClass: "text-center"
    },
    {
        label: "Trạng thái",
        field: "status",
        width: '130px',
        thClass: "text-center",
        tdClass: "text-center"
    },
    {
        label: "Thao tác",
        field: "action",
        width: '130px',
        thClass: "text-center",
        tdClass: "text-center"
    }
])
const historicalSites = ref([])
const loading = ref(false);
const action = ref();

onMounted(() => {
    onSearch();
})

function updateHistoricalSites(data) {
    updateDialogState.value = true;
    userDataUpdate.value = data;
}

function deleteHistoricalSites(data) {
    deleteDialogState.value = true;
    userDataDelete.value = data;
}

async function onSearch() {
    let res = await getHistoricalSites();
    if (res && res.data)
        historicalSites.value = res.data
}
</script>


