<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title mb-3" color="primary" title="Danh sách tham số"></v-toolbar>
    <v-card-subtitle>Danh sách toàn bộ tham số trên hệ thống. Bạn có thể thêm mới, sửa, xóa và cập nhật tham
      số</v-card-subtitle>
    <v-card-actions>
      <v-btn variant="outlined" size="small" color="primary" @click="createDiatate = true" class="mt-3">Thêm mới</v-btn>
    </v-card-actions>
  </v-card>

  <!-- Card content -->
  <v-card class="mx-auto mt-5">
    <vue-good-table ref="someTable" :columns="columns" :rows="systemConfigs" :line-numbers="true" :loading="loading"
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
        <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
          <v-btn @click="updateSystemConfig(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary"
            class="mx-1" icon="mdi-pencil">
            <v-icon color="secondary">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">Sửa tham số</v-tooltip>
          </v-btn>
          <v-btn @click="deleteSystemConfig(props.row)" variant="outlined" size="x-small" color="error" class="mx-1"
            icon="mdi-delete">
            <v-icon color="error">mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Xóa tham số</v-tooltip>
          </v-btn>
        </div>
      </template>
    </vue-good-table>
  </v-card>

  <SystemConfigCreate v-model:is-show="createDiatate" v-on:done="onSearch" />
  <SystemConfigUpdate v-model:is-show="updateDiatate" :data="dataUpdate" v-on:done="onSearch" />
  <SystemConfigDelete v-model:is-show="deleteDiatate" :data="dataDelete" v-on:done="onSearch" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import SystemConfigCreate from './SystemConfigCreate.vue';
import SystemConfigUpdate from './SystemConfigUpdate.vue'
import SystemConfigDelete from './SystemConfigDelete.vue'
import { getSystemConfigs } from '@/apis/modules/systemconfigs.api';
import { useAppStore } from '@/store/app.store';

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDiatate = ref(false);
const updateDiatate = ref(false);
const deleteDiatate = ref(false);
const dataUpdate = ref(null);
const dataDelete = ref(null);

const columns = ref([
  {
    label: "Mã tham số",
    field: "configkey",
    thClass: "text-center"
  },
  {
    label: "Giá trị",
    field: "configvalue",
    thClass: "text-center"
  },
  {
    label: "Trạng thái",
    field: "status",
    width: '200px',
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
const systemConfigs = ref([])
const loading = ref(false);
const action = ref();

onMounted(() => {
  onSearch();
})

function updateSystemConfig(data) {
  updateDiatate.value = true;
  dataUpdate.value = data;
}

function deleteSystemConfig(data) {
  deleteDiatate.value = true;
  dataDelete.value = data;
}

async function onSearch() {
  let res = await getSystemConfigs();
  if (res && res.data)
    systemConfigs.value = res.data
}
</script>


