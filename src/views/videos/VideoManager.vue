<template>
<v-card class="mb-5 card-search">
    <v-toolbar class="title" color="primary" title="Danh sách video">
      </v-toolbar>
    <v-card-text>
      <v-row class="mt-2 mb-1">
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="5">
          <v-select
            v-model="data.selectNewCategoryId"
            @update:modelValue="onSearch"
            variant="outlined"
            label="Chuyên mục video"
            :items="newCategories"
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
              color="success"  
              @click="createDialogState = true"
            >
            <v-icon left>mdi-video</v-icon>
                Thêm video
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
    :rows="videos"
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
        <v-btn @click="updateVideo(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa video</v-tooltip>
        </v-btn>
        <v-btn @click="deleteVideo(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa video</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>
  
  <VideoCreate v-model:is-show="createDialogState" v-on:done="onSearch"/>
  <VideoUpdate v-model:is-show="updateDialogState" :data="dataUpdate" v-on:done="onSearch"/>
  <VideoDelete v-model:is-show="deleteDialogState" :data="dataDelete" v-on:done="onSearch"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import VideoCreate from './VideoCreate.vue';
import VideoUpdate from './VideoUpdate.vue'
import VideoDelete from './VideoDelete.vue'
import { getVideoByCategoryId } from '@/apis/modules/videos.api';
import { getTreeNewsCategories } from '@/apis/modules/newscategories.api';
import { useAppStore } from '@/store/app.store';
import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const dataUpdate = ref(null);
const dataDelete = ref(null);

const columns = ref([
    {
      label: "Tên video",
      field: "videoname",
      thClass:"text-center"
    },
    {
      label: "Mô tả",
      field: "description",
      thClass:"text-center"
    },
    {
      label: "Trạng thái",
      field: "status",
      width: '150px',
      thClass:"text-center",
      tdClass:"text-center"
    },
    {
      label: "Thao tác",
      field: "action",
      width: '100px',
      thClass:"text-center",
      tdClass:"text-center"
    }
    ])
const videos = ref([])
const loading = ref(false);

const data = reactive({
  selectNewCategoryId: { label: '--Tất cả--', value: null },
  selectStatus: { label: '--Tất cả--', value: null },
})
const newCategories = ref([])
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
  newCategories.value = [{
    label: "--Tất cả--",
    value: null
  }];

  let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.VIDEO,1);
  resCategories.data.map(category=>{
    newCategories.value.push({
      label: category.newscategoryname,
      value: category._id
    })
  });

  onSearch();
})

function updateVideo(data){
  updateDialogState.value = true;
  dataUpdate.value = data;
}

function deleteVideo(data){
  deleteDialogState.value = true;
  dataDelete.value = data;
}

async function onSearch(){
  let res = await getVideoByCategoryId(data.selectNewCategoryId.value, data.selectStatus.value);
  if(res && res.data)
    videos.value = res.data
}
</script>


