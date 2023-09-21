<template>
<v-card class="mb-5 card-search">
    <v-toolbar class="title" color="primary" title="Danh sách bài viết">
      </v-toolbar>
    <v-card-text>
      <v-row class="mt-2 mb-1">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="data.keyword"
            v-on:keyup.enter="onSearch(1)"
            label="Tiêu đề bài viết"
            placeholder="Nhập tiêu đề bài viết"
            variant="outlined"
            type="input"
            class="ml-lg-3"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="data.selectNewCategoryId"
            @update:modelValue="onSearch(1)"
            variant="outlined"
            label="Chuyên mục bài viết"
            :items="newCategories"
            item-title="label"
            item-value="value"
            return-object
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="data.selectNewsStatus"
            @update:modelValue="onSearch(1)"
            variant="outlined"
            label="Trạng thái"
            :items="newsStatus"
            item-title="label"
            item-value="value"
            class="mr-lg-3"
            return-object
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12" md="12" class="d-flex justify-center align-baseline">
            <v-btn
            variant="outlined"
              color="orange-darken-2" 
              prepend-icon="mdi-magnify"
              @click="onSearch(1)" 
            > 
             Tìm kiếm
            </v-btn>
            <v-btn 
              variant="outlined"
              color="success"  
              @click="createDialogState = true"
            >
            <v-icon left>mdi-newspaper-variant-outline</v-icon>
                Tạo bài viết
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
    :rows="news"
    :line-numbers="false"
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
      perPage: 10,
      setCurrentPage: currentPage
    }"
    :totalRows="totalRecords"
    v-on:page-change="onPageChange"
  >
  <template #emptystate>
    Không có dữ liệu
  </template>
  <template #table-row="props">
    <!-- <div v-if="props.column.field === 'publishdate'" class="center">
      {{props.row.publishdate ? moment(props.row.publishdate,'YYYY-MM-DD') : ""}}
    </div> -->
    <div v-if="props.column.field === 'newsstatus'" class="center">
      <v-badge v-if="props.row.newsstatus == 2"  content="Đã xuất bản" color="success" inline></v-badge>
      <v-badge v-else-if="props.row.newsstatus == 1"  content="Đã duyệt" color="warning" inline></v-badge>
      <v-badge v-else  content="Mới tạo lập" color="info" inline></v-badge>
    </div>
    <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
        <v-btn @click="updateNews(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa bài viết</v-tooltip>
        </v-btn>
        <v-btn @click="deleteNews(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa bài viết</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>

  <NewsCreate v-model:is-show="createDialogState"  v-on:done="onSearch(1)"/>
  <NewsUpdate v-model:is-show="updateDialogState" :data="dataUpdate" v-on:done="onSearch(1)"/>
  <NewsDelete v-model:is-show="deleteDialogState" :data="dataDelete" v-on:done="onSearch(1)"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import moment from 'moment';
import NewsCreate from './NewsCreate.vue'
import NewsUpdate from './NewsUpdate.vue'
import NewsDelete from './NewsDelete.vue'
import { getNewsByCategoryId, getCountNewsByCategoryId, getNewsById } from '@/apis/modules/news.api';
import { getTreeNewsCategories } from '@/apis/modules/newscategories.api';
import { useAppStore } from '@/store/app.store';
import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, STATUS_DISABLED, NEWS_STATUS } from '@/utils/constants'


const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const dataUpdate = ref(null);
const dataDelete = ref(null);

const columns = ref([
    {
      label: "Tiêu đề bài viết",
      field: "title",
      thClass:"text-center"
    },
    {
      label: "Mô tả",
      field: "description",
      thClass:"text-center"
    },
    {
      label: "Ngày xuất bản",
      field: "publishdate",
      width: '130px',
      thClass:"text-center",
      tdClass:"text-center"
    },
    {
      label: "Trạng thái",
      field: "newsstatus",
      width: '110px',
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
const news = ref([])

const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const loading = ref(false);

const data = reactive({
  selectNewCategoryId: { label: '--Tất cả--', value: null },
  selectNewsStatus: { label: '--Tất cả--', value: null },
  keyword: null
})
const newCategories = ref([])
const newsStatus = ref([{
    label: "--Tất cả--",
    value: null
  },
  {
    label: "Mới tạo",
    value: NEWS_STATUS.CREATED
  },
  {
    label: "Đã duyệt",
    value: NEWS_STATUS.APPORVED
  },
  {
    label: "Đã xuất bản",
    value: NEWS_STATUS.PUBLISHED
  }])

onMounted(async ()=>{
  newCategories.value = [{
    label: "--Tất cả--",
    value: null
  }];

  let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.NEWS,1);
  resCategories.data.map(category=>{
    newCategories.value.push({
      label: category.newscategoryname,
      value: category._id
    })
  });

  onSearch(1);
})

async function  updateNews(data){
  let news = await getNewsById(data._id)
    if( news && news.data)
    {
      dataUpdate.value = news.data;
      updateDialogState.value = true;
    }
}

function deleteNews(data){
  deleteDialogState.value = true;
  dataDelete.value = data;
}

async function onSearch(page){
  currentPage.value=page
  let res = await getNewsByCategoryId(data.selectNewCategoryId.value, STATUS_ACTIVED,data.selectNewsStatus.value,data.keyword,page,perPage.value);
  let resCount = await getCountNewsByCategoryId(data.selectNewCategoryId.value, STATUS_ACTIVED,data.selectNewsStatus.value,data.keyword);
  if(res && res.data)
    news.value = res.data.map(news=>{
      return{
        ...news,
        publishdate : news.publishdate ? moment(news.publishdate).format("DD/MM/YYYY") : null
      }
    })

  if(resCount && resCount.data)
    totalRecords.value = resCount.data
}
function onPageChange(params){
  onSearch(params.currentPage)
}
</script>


