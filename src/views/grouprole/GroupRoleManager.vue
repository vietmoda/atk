<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title mb-3" color="primary" title="Danh sách nhóm quyền"></v-toolbar>
    <v-card-subtitle>Danh sách toàn bộ nhóm quyền trên hệ thống. Bạn có thể thêm mới, sửa, xóa và cập nhật nhóm quyền</v-card-subtitle>
    <v-card-actions>
      <v-btn variant="outlined" size="small" color="primary" @click="createDialogState = true" class="mt-3">Thêm mới</v-btn>
    </v-card-actions>
  </v-card>

  <!-- Card content -->
  <v-card
    class="mx-auto mt-5"
  >
  <vue-good-table
    ref="someTable"
    :columns="columns"
    :rows="groupRoles"
    :line-numbers="true"
    :loading="loading"
    :sort-options="{
      enabled: true
    }"
    :search-options="{
      enabled: true,
      placeholder: 'Nhập từ khóa để tìm kiếm',
    }"
    :pagination-options="{
    enabled: true,
    perPageDropdownEnabled: false,
    nextLabel: 'Trang sau',
    prevLabel: 'Trang trước',
    ofLabel: 'của',
    }"
  >
  <template #emptystate>
    Không có dữ liệu
  </template>
  <template #table-row="props">
    <div v-if="props.column.field === 'status'" class="center">
      <v-badge v-if="props.row.status == 1"  content="Hoạt động" color="success" inline></v-badge>
      <v-badge v-else  content="Không hoạt động" color="warning" inline></v-badge>
    </div>
    <div v-else-if="props.column.field === 'action'" class="">
      <div v-if="props.row.status == 1" class="d-flex justify-center">
        <v-btn @click="updateGroupRole(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa nhóm quyền</v-tooltip>
        </v-btn>
        <v-btn @click="lockGroupRole(props.row)" v-bind="props" variant="outlined" size="x-small" color="warning" class="mx-1" icon="mdi-lock">
          <v-icon color="warning">mdi-lock</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Khoá nhóm quyền</v-tooltip>
        </v-btn>
        <v-btn @click="deleteGroupRole(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa nhóm quyền</v-tooltip>
        </v-btn>
      </div>
      <div v-if="props.row.status != 1" class="d-flex justify-right">
            <v-btn @click="lockGroupRole(props.row)" v-bind="props" variant="outlined" size="x-small" color="success" class="mx-1" icon="mdi-lock-open">
              <v-icon color="success">mdi-lock-open</v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >Mở khoá nhóm quyền</v-tooltip>
            </v-btn>
            <v-btn @click="deleteGroupRole(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
              <v-icon color="error">mdi-delete</v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >Xóa nhóm quyền</v-tooltip>
            </v-btn>
      </div>
      </div>
  </template>
  </vue-good-table>
  </v-card>
  
  <GroupRoleCreate  v-model:is-show="createDialogState" v-on:done="onSearch"/>
  <GroupRoleUpdate v-model:is-show="updateDialogState" :data="userDataUpdate" v-on:done="onSearch"/>
  <GroupRoleDelete v-model:is-show="deleteDialogState" :data="userDataDelete" v-on:done="onSearch"/>
  <GroupRoleLock v-model:is-show="lockDialogState" :data="userDataLock" v-on:done="onSearch"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import GroupRoleCreate from './GroupRoleCreate.vue';
import GroupRoleUpdate from './GroupRoleUpdate.vue'
import GroupRoleDelete from './GroupRoleDelete.vue'
import GroupRoleLock from './GroupRoleLock.vue'
import { getGroupRole } from '@/apis/modules/grouproles.api';
import { useAppStore } from '@/store/app.store';

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const lockDialogState = ref(false);
const userDataUpdate = ref(null);
const userDataDelete = ref(null);
const userDataLock = ref(null);

const columns = ref([
    {
      label: "Tên nhóm quyền",
      field: "groupname",
      thClass:"text-center"
    },
    {
      label: "Trạng thái",
      field: "status",
      width: '200px',
      thClass:"text-center",
      tdClass:"text-center"
    },
    {
      label: "Thao tác",
      field: "action",
      width: '130px',
      thClass:"text-center",
      tdClass:"text-center"
    }
    ])
const groupRoles = ref([])
const loading = ref(false);
const action = ref();

onMounted(()=>{
  onSearch();
})

function updateGroupRole(data){
  updateDialogState.value = true;
  userDataUpdate.value = data;
}

function deleteGroupRole(data){
  deleteDialogState.value = true;
  userDataDelete.value = data;
}

function lockGroupRole(data){
  lockDialogState.value = true;
  userDataLock.value = data;
}

async function onSearch(){
  let res = await getGroupRole();
  if(res && res.data)
    groupRoles.value = res.data
}
</script>


