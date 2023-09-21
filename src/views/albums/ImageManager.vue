<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title" color="primary" title="Danh sách hình ảnh">
      </v-toolbar>
    <v-card-text>
      <v-row class="mt-2 mb-1">
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="5">
          <v-select
            v-model="data.selectNewCategoryId"
            @update:modelValue="onSearch"
            variant="outlined"
            label="Album ảnh"
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
            <v-icon left>mdi-image</v-icon>
                Thêm ảnh
            </v-btn>
            <v-btn 
              variant="outlined"
              color="orange-darken-2"  
              @click="createAlbumDialogState = true"
            >
            <v-icon left>mdi-image-multiple</v-icon>
                Thêm album ảnh
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
    :rows="albums"
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
    <div v-else-if="props.column.field === 'image'" class="d-flex justify-center">
      <img height="110" width="110" 
        :title="props.row?.imagefile[0]?.originalname || 'Không có ảnh'"
        :src="props.row?.imagefile[0]?.fileurl ? `${MEDIA_SERVER}/${props.row?.imagefile[0]?.fileurl}` : 'src/assets/images/no-image.png'">
    </div>
    <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
        <v-btn @click="updateAlbum(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa ảnh</v-tooltip>
        </v-btn>
        <v-btn @click="deleteAlbum(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa ảnh</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>
  
  <AlbumCreate v-model:is-show="createAlbumDialogState" v-on:done="onSearch"/>
  <ImageCreate v-model:is-show="createDialogState" v-on:done="onSearch"/>
  <ImageUpdate v-model:is-show="updateDialogState" :data="dataUpdate" v-on:done="onSearch"/>
  <ImageDelete v-model:is-show="deleteDialogState" :data="dataDelete" v-on:done="onSearch"/>
</template>

<script setup>
import { MEDIA_SERVER } from '@/apis/httpClient';
import {reactive, ref, onMounted } from 'vue'
import AlbumCreate from './AlbumCreate.vue';
import ImageCreate from './ImageCreate.vue';
import ImageUpdate from './ImageUpdate.vue'
import ImageDelete from './ImageDelete.vue'
import { getAlbums, getAlbumByCategoryId } from '@/apis/modules/albums.api';
import { getTreeNewsCategories } from '@/apis/modules/newscategories.api';
import { useAppStore } from '@/store/app.store';
import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, STATUS_DISABLED } from '@/utils/constants'

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const createAlbumDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const dataUpdate = ref(null);
const dataDelete = ref(null);

const columns = ref([
    {
      label: "Tên ảnh",
      field: "imagename",
      thClass:"text-center"
    },
    {
      label: "Mô tả",
      field: "description",
      thClass:"text-center"
    },
    {
      label: "Hình ảnh",
      field: "image",
      width: '120px',
      thClass:"text-center",
      tdClass:"text-center"
    },
    {
      label: "Trạng thái",
      field: "status",
      width: '120px',
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
const albums = ref([])
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

  let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.ALBUM,1);
  resCategories.data.map(category=>{
    newCategories.value.push({
      label: category.newscategoryname,
      value: category._id
    })
  });

  onSearch();
})

function updateAlbum(data){
  updateDialogState.value = true;
  dataUpdate.value = data;
}

function deleteAlbum(data){
  deleteDialogState.value = true;
  dataDelete.value = data;
}

async function onSearch(){
  let res = await getAlbumByCategoryId(data.selectNewCategoryId.value, data.selectStatus.value);
  if(res && res.data)
    albums.value = res.data
}
</script>


