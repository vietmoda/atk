<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title mb-3" color="primary" title="Danh sách thực đơn"></v-toolbar>
    <v-card-subtitle>Danh sách toàn bộ thực đơn trên hệ thống. Bạn có thể thêm mới, sửa, xóa và cập nhật thực đơn</v-card-subtitle>
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
    :rows="suggestedMenus"
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
    <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
        <v-btn @click="updateSuggestedMenu(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa thực đơn</v-tooltip>
        </v-btn>
        <v-btn @click="deleteSuggestedMenu(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa thực đơn</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>
  
  <SuggestedMenuCreate v-model:is-show="createDialogState" v-on:done="onSearch"/>
  <SuggestedMenuUpdate v-model:is-show="updateDialogState" :data="userDataUpdate" v-on:done="onSearch"/>
  <SuggestedMenuDelete v-model:is-show="deleteDialogState" :data="userDataDelete" v-on:done="onSearch"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import SuggestedMenuCreate from './SuggestedMenuCreate.vue';
import SuggestedMenuUpdate from './SuggestedMenuUpdate.vue'
import SuggestedMenuDelete from './SuggestedMenuDelete.vue'
import { getSuggestedMenus } from '@/apis/modules/suggestedmenus.api';
import { useAppStore } from '@/store/app.store';

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const userDataUpdate = ref(null);
const userDataDelete = ref(null);

const columns = ref([
    {
      label: "Tên thực đơn",
      field: "menuname",
      thClass:"text-center"
    },
    {
      label: "Giá",
      field: "price",
      width: '250px',
      thClass:"text-center"
    },
    {
      label: "Số thực khách",
      field: "numberdiners",
      width: '130px',
      thClass:"text-center"
    },
    {
      label: "Trạng thái",
      field: "status",
      width: '130px',
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
const suggestedMenus = ref([])
const loading = ref(false);
const action = ref();

onMounted(()=>{
  onSearch();
})

function updateSuggestedMenu(data){
  updateDialogState.value = true;
  userDataUpdate.value = data;
}

function deleteSuggestedMenu(data){
  deleteDialogState.value = true;
  userDataDelete.value = data;
}

async function onSearch(){
  let res = await getSuggestedMenus();
  if(res && res.data)
    suggestedMenus.value = res.data
}
</script>


