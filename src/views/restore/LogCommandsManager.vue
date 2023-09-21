<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title mb-3" color="primary" title="Khôi phục dữ liệu"></v-toolbar>
  </v-card>

  <!-- Card content -->
  <v-card class="mx-auto mt-5">
    <vue-good-table ref="someTable" :columns="columns" :rows="logs" :line-numbers="true" :loading="loading" :sort-options="{
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
  perPage: 10,
  setCurrentPage: currentPage
}" :totalRows="totalRecords" v-on:page-change="onPageChange">
      <template #emptystate>
        Không có dữ liệu
      </template>
      <template #table-row="props">
        <div v-if="props.column.field === 'action'" class="d-flex justify-center">
          <v-btn @click="viewLog(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary"
            class="mx-1" icon="mdi-pencil">
            <v-icon color="secondary">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">Xem chi tiết</v-tooltip>
          </v-btn>
        </div>
      </template>
    </vue-good-table>
  </v-card>
  <DetailDialogState v-model:is-show="detailDialogState" :data="userDataDetail" v-on:done="onSearch" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import moment from 'moment';
import { getLogs, getCountLogs } from '@/apis/modules/logs.api';
import { useAppStore } from '@/store/app.store';
import DetailDialogState from './LogDetail.vue'
import { ACTION_TYPE, COLLECTION_NAME } from '@/utils/constants'


const columns = ref([
  {
    label: "Tên di tích lịch sử đã xóa",
    field: "actiontype",
    thClass: "text-center"
  },
  {
    label: "Mô tả",
    field: "collectionname",
    thClass: "text-center"
  },
  {
    label: "Khôi phục",
    field: "action",
    width: '150px',
    thClass: "text-center",
    tdClass: "text-center"
  }
])

const userDataDetail = ref(null);

const logs = ref([])

const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const loading = ref(false);

const detailDialogState = ref(false);

const collectionName = ref([
  {
    label: "--Tất cả--",
    value: null
  },
  {
    label: "User",
    value: COLLECTION_NAME.User
  },
  {
    label: "Newscategories",
    value: COLLECTION_NAME.Newscategories
  },
  {
    label: "News",
    value: COLLECTION_NAME.News
  },
  {
    label: "Systemconfigs",
    value: COLLECTION_NAME.Systemconfigs
  },
  {
    label: "Files",
    value: COLLECTION_NAME.Files
  },
  {
    label: "Ordermenus",
    value: COLLECTION_NAME.Ordermenus
  },
  {
    label: "Suggestedmenus",
    value: COLLECTION_NAME.Suggestedmenus
  },
  {
    label: "Bookings",
    value: COLLECTION_NAME.Bookings
  },
  {
    label: "Weblinks",
    value: COLLECTION_NAME.Weblinks
  },
  {
    label: "Albums",
    value: COLLECTION_NAME.Albums
  },
  {
    label: "Categories",
    value: COLLECTION_NAME.Categories
  },
  {
    label: "Videos",
    value: COLLECTION_NAME.Videos
  },
  {
    label: "Items",
    value: COLLECTION_NAME.Items
  },
  {
    label: "Categoryitems",
    value: COLLECTION_NAME.Categoryitems
  },
  {
    label: "Groups",
    value: COLLECTION_NAME.Groups
  },
  {
    label: "Roles",
    value: COLLECTION_NAME.Roles
  }
]);

const actionType = ref([
  {
    label: "--Tất cả--",
    value: null
  },
  {
    label: "ADD",
    value: ACTION_TYPE.ADD
  },
  {
    label: "EDIT",
    value: ACTION_TYPE.EDIT
  },
  {
    label: "LOGIN",
    value: ACTION_TYPE.LOGIN
  },
  {
    label: "DELETE",
    value: ACTION_TYPE.DELETE
  },
  {
    label: "STATUS",
    value: ACTION_TYPE.STATUS
  }
]);

const data = reactive({
  actiontype: { label: '--Tất cả--', value: null },
  collectionname: { label: '--Tất cả--', value: null },
  keyword: null,
  startdate: null,
  enddate: null
})

onMounted(async () => {
  // collectionName.value = [{
  //     label: "--Tất cả--",
  //     value: null
  // }];

  // // let resLogs = await getLogs();
  // // resLogs.data.map(collection => {
  // //     collectionName.value.push({
  // //         label: collection.collectionname,
  // //         value: collection._id
  // //     }) 
  // // })

  // let resLogs = await getLogs();

  // // Biến tạm để lưu trữ các giá trị collection.collectionname đã xuất hiện
  // const existingLabels = new Set();

  // // Duyệt qua các phần tử trong mảng resLogs.data
  // resLogs.data.forEach(collection => {
  //     // Kiểm tra xem collection.collectionname đã tồn tại trong biến tạm chưa
  //     if (!existingLabels.has(collection.collectionname)) {
  //         // Nếu chưa tồn tại, thêm giá trị mới vào mảng collectionName.value
  //         collectionName.value.push({
  //             label: collection.collectionname,
  //             value: collection._id
  //         });

  //         // Đánh dấu collection.collectionname đã xuất hiện trong biến tạm
  //         existingLabels.add(collection.collectionname);
  //     }
  // });

  onSearch(1);
})

async function onSearch(page) {

  console.log(data)
  console.log({
    page: page,
    per: perPage.value
  })

  let startDate = data.startdate ? moment(data.startdate, 'YYYY-MM-DD').format('DD/MM/YYYY') : null
  let endDate = data.enddate ? moment(data.enddate, 'YYYY-MM-DD').format('DD/MM/YYYY') : null


  let res = await getLogs(data.actiontype.value, data.collectionname.value, data.keyword, startDate, endDate, page, perPage.value)
  let resCount = await getCountLogs(data.actiontype.value, data.collectionname.value, data.keyword, startDate, endDate);
  console.log(res);
  currentPage.value = page
  if (res && res.data)
    logs.value = res.data

  if (resCount && resCount.data)
    totalRecords.value = resCount.data
}
function onPageChange(params) {
  onSearch(params.currentPage)
}

// function changeCollectionName() {
//     getLogs(data.collectionname?.value);
// }

function viewLog(data) {
  detailDialogState.value = true
  userDataDetail.value = data

  console.log(data)
}

</script>


