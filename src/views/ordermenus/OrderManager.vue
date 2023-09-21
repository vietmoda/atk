<template>
<v-card class="mb-5 card-search">
    <v-toolbar class="title" color="primary" title="Danh sách đặt bàn">
      </v-toolbar>
    <v-card-text>
      <v-row class="mt-2 mb-1">
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="data.keyword"
            v-on:keyup.enter="onSearch(1)"
            label="Tên khách hàng"
            placeholder="Nhập tên khách hàng tìm kiếm"
            variant="outlined"
            type="input"
            class="ml-lg-3"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="data.selectProcessStatus"
            @update:modelValue="onSearch(1)"
            variant="outlined"
            label="Trạng thái"
            :items="bookingProcessStatus"
            item-title="label"
            item-value="value"
            class="mr-lg-3"
            return-object
          />
        </v-col>
        <v-col cols="12" md="2"></v-col>
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
            <v-icon left>mdi-plus</v-icon>
                Đặt bàn
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
    :rows="orderMenus"
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
    <div v-if="props.column.field === 'processstatus'" class="center">
      <v-badge v-if="props.row.processstatus == 1"  content="Đã hoàn tất" color="success" inline></v-badge>
      <v-badge v-else-if="props.row.processstatus == 2"  content="Đang xử lý" color="warning" inline></v-badge>
      <v-badge v-else  content="Mới tạo lập" color="info" inline></v-badge>
    </div>
    <div v-else-if="props.column.field === 'time'" class="center">
        <span>{{props.row.visitdateStr}} {{props.row.visithour}}</span>
    </div>
    <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
        <v-btn @click="updateOrder(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa thông tin đặt bàn</v-tooltip>
        </v-btn>
        <v-btn @click="updateProcess(props.row)" v-bind="props" variant="outlined" size="x-small" color="warning" class="mx-1" icon="mdi-check-underline">
          <v-icon color="warning">mdi-check-underline</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Cập nhật trạng thái xử lý</v-tooltip>
        </v-btn>
        <v-btn @click="deleteOrder(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa thông tin đặt bàn</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>

  <OrderProcessUpdate v-model:is-show="updateProcessDialogState" :data="dataUpdateProcess"  v-on:done="onSearch(1)"/>
  <OrderCreate v-model:is-show="createDialogState"  v-on:done="onSearch(1)"/>
  <OrderUpdate v-model:is-show="updateDialogState" :data="dataUpdate" v-on:done="onSearch(1)"/>
  <OrderDelete v-model:is-show="deleteDialogState" :data="dataDelete" v-on:done="onSearch(1)"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import moment from 'moment';
import OrderProcessUpdate from './OrderProcessUpdate.vue'
import OrderCreate from './OrderCreate.vue'
import OrderUpdate from './OrderUpdate.vue'
import OrderDelete from './OrderDelete.vue'
import { getOrderMenusPaging, getCountOrderMenusPaging } from '@/apis/modules/ordermenus.api';
import { useAppStore } from '@/store/app.store';
import { STATUS_ACTIVED, STATUS_DISABLED, PROCESS_STATUS } from '@/utils/constants'


const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const createDialogState = ref(false);
const updateDialogState = ref(false);
const updateProcessDialogState = ref(false);
const deleteDialogState = ref(false);
const dataUpdate = ref(null);
const dataUpdateProcess = ref(null);
const dataDelete = ref(null);

const columns = ref([
    {
      label: "Tên khách hàng",
      field: "fullname",
      thClass:"text-center"
    },
    {
      label: "Nội dung",
      field: "content",
      thClass:"text-center"
    },
    {
      label: "Số điện thoại",
      field: "telephone",
      width: '125px',
      thClass:"text-center",
      tdClass:"text-center"
    },
    {
      label: "Thời gian",
      field: "time",
      width: '100px',
      thClass:"text-center",
      tdClass:"text-center"
    },
    {
      label: "Trạng thái",
      field: "processstatus",
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
const orderMenus = ref([])

const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const loading = ref(false);

const data = reactive({
  selectProcessStatus: { label: '--Tất cả--', value: null },
  keyword: null
})

const bookingProcessStatus = ref([{
    label: "--Tất cả--",
    value: null
  },
  {
    label: "Mới tạo",
    value: PROCESS_STATUS.NEW
  },
  {
    label: "Đang xử lý",
    value: PROCESS_STATUS.PROCESSED
  },
  {
    label: "Đã hoàn tất",
    value: PROCESS_STATUS.VISITED
  }])

onMounted(async ()=>{
  onSearch(1);
})

function updateOrder(data){
  updateDialogState.value = true;
  dataUpdate.value = data;
}

function updateProcess(data){
  updateProcessDialogState.value = true;
  dataUpdateProcess.value = data;
}

function deleteOrder(data){
  deleteDialogState.value = true;
  dataDelete.value = data;
}

async function onSearch(page){
  currentPage.value=page
  let res = await getOrderMenusPaging(STATUS_ACTIVED,data.selectProcessStatus.value,data.keyword,page,perPage.value);
  let resCount = await getCountOrderMenusPaging(STATUS_ACTIVED,data.selectProcessStatus.value,data.keyword);
  if(res && res.data)
    orderMenus.value = res.data.map(booking=>{
      return{
        ...booking,
        visitdateStr : booking.visitdate ? moment(booking.visitdate).format("DD/MM/YYYY") : null
      }
    })

  if(resCount && resCount.data)
    totalRecords.value = resCount.data
}
function onPageChange(params){
  onSearch(params.currentPage)
}
</script>


