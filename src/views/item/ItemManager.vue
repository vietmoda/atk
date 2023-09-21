<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title" color="primary" title="Danh sách danh mục chi tiết">
      </v-toolbar>
    <v-card-text>
      <v-row class="mt-2 mb-1">
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="5">
          <v-select
            v-model="data.selectCategoryId"
            @update:modelValue="onSearch"
            variant="outlined"
            label="Danh mục"
            :items="categories"
            item-title="label"
            item-value="value"
            class="ml-lg-3"
            return-object
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="data.selectStatus"
            @update:modelValue="onSearch"
            variant="outlined"
            label="Trạng thái"
            :items="status"
            item-title="label"
            item-value="value"
            class="ml-lg-3"
            return-object
          />
        </v-col>
        <v-col cols="12" md="2"></v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12" md="12" class="d-flex justify-center align-baseline">
            <!-- <v-btn
            variant="outlined"
              color="orange-darken-2" 
              prepend-icon="mdi-magnify"
              @click="onSearch" 
            > 
             Tìm kiếm
            </v-btn> -->
            <v-btn 
              variant="outlined"
              color="primary"  
              @click="createDialogState = true"
            >
                Thêm mới
            </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
  <!-- Card content -->
  <v-card
    class="mx-auto mt-5"
  >
  <vue-good-table
    ref="someTable"
    :columns="columns"
    :rows="items"
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
        <v-btn @click="updateItem(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa danh mục chi tiết</v-tooltip>
        </v-btn>
        <v-btn @click="deleteItem(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa danh mục chi tiết</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>
  
  <ItemCreate v-model:is-show="createDialogState" v-on:done="onSearch"/>
  <ItemUpdate v-model:is-show="updateDialogState" :data="userDataUpdate" v-on:done="onSearch"/>
  <ItemDelete v-model:is-show="deleteDialogState" :data="userDataDelete" v-on:done="onSearch"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import ItemCreate from './ItemCreate.vue';
import ItemUpdate from './ItemUpdate.vue'
import ItemDelete from './ItemDelete.vue'
import { getItemByCategoryId } from '@/apis/modules/items.api';
import { getCategories } from '@/apis/modules/category.api';
import { useAppStore } from '@/store/app.store';
import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

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
      label: "Tên danh mục chi tiết",
      field: "itemname",
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
const items = ref([])
const loading = ref(false);
const data = reactive({
  selectCategoryId: { label: '--Tất cả--', value: null },
  selectStatus: { label: '--Tất cả--', value: null },
})
const categories = ref([])
const status = ref([{
    label: "--Tất cả--",
    value: null
  },
  {
    label: "Hoạt động",
    value: STATUS_ACTIVED
  },
  {
    label: "Không hoạt động",
    value: STATUS_DISABLED
  }])


onMounted(async ()=>{
  categories.value = [{
    label: "--Tất cả--",
    value: null
  }];

  let resCategories = await getCategories(STATUS_ACTIVED);
  resCategories.data.map(category=>{
    categories.value.push({
      label: category.categoryname,
      value: category._id
    })
  });

  onSearch();
})

function updateItem(data){
  updateDialogState.value = true;
  userDataUpdate.value = data;
}

function deleteItem(data){
  deleteDialogState.value = true;
  userDataDelete.value = data;
}

async function onSearch(){
  console.log(data.selectStatus)
  let res = await getItemByCategoryId(data.selectCategoryId.value, data.selectStatus.value);
  if(res && res.data)
    items.value = res.data
}
</script>


