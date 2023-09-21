<template>
<v-card class="mb-5 card-search">
    <v-toolbar class="title" color="primary" title="Danh sách khách hàng đặt lịch dâng hương">
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
            v-model="data.selectBookingProcessStatus"
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
    :rows="bookings"
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
      <v-badge v-if="props.row.processstatus == 1"  content="Đã đến thăm" color="success" inline></v-badge>
      <v-badge v-else-if="props.row.processstatus == 2"  content="Đang xử lý" color="warning" inline></v-badge>
      <v-badge v-else  content="Mới tạo lập" color="info" inline></v-badge>
    </div>
    <div v-else-if="props.column.field === 'time'" class="center">
        <span>{{props.row.visitdateStr}} {{props.row.visithour}}</span>
    </div>
    <div v-else-if="props.column.field === 'action'" class="d-flex justify-center">
        <v-btn @click="updateBooking(props.row)" v-bind="props" variant="outlined" size="x-small" color="secondary" class="mx-1" icon="mdi-pencil">
          <v-icon color="secondary">mdi-pencil</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Sửa đặt lịch dâng hương</v-tooltip>
        </v-btn>
        <v-btn @click="updateProcess(props.row)" v-bind="props" variant="outlined" size="x-small" color="warning" class="mx-1" icon="mdi-check-underline">
          <v-icon color="warning">mdi-check-underline</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Cập nhật trạng thái xử lý</v-tooltip>
        </v-btn>
        <v-btn @click="deleteBooking(props.row)" variant="outlined" size="x-small" color="error" class="mx-1" icon="mdi-delete">
          <v-icon color="error">mdi-delete</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa đặt lịch dâng hương</v-tooltip>
        </v-btn>
      </div>
  </template>
  </vue-good-table>
  </v-card>

  <BookingProcessUpdate v-model:is-show="updateProcessDialogState" :data="dataUpdateProcess"  v-on:done="onSearch(1)"/>
  <BookingUpdate v-model:is-show="updateDialogState" :data="dataUpdate" v-on:done="onSearch(1)"/>
  <BookingDelete v-model:is-show="deleteDialogState" :data="dataDelete" v-on:done="onSearch(1)"/>
</template>

<script setup>
import {reactive, ref, onMounted } from 'vue'
import moment from 'moment';
import BookingProcessUpdate from './BookingProcessUpdate.vue'
import BookingUpdate from './BookingUpdate.vue'
import BookingDelete from './BookingDelete.vue'
import { getBookingsPaging, getCountBookingsPaging } from '@/apis/modules/bookings.api';
import { useAppStore } from '@/store/app.store';
import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, STATUS_DISABLED, PROCESS_STATUS } from '@/utils/constants'


const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const updateDialogState = ref(false);
const updateProcessDialogState = ref(false);
const deleteDialogState = ref(false);
const dataUpdate = ref(null);
const dataUpdateProcess = ref(null);
const dataDelete = ref(null);

const columns = ref([
    {
      label: "Tên khách hàng",
      field: "visitername",
      thClass:"text-center"
    },
    {
      label: "Người đại diện",
      field: "leaderinfo",
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
      label: "Ngày đến",
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
const bookings = ref([])

const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const loading = ref(false);

const data = reactive({
  selectBookingProcessStatus: { label: '--Tất cả--', value: null },
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
    label: "Đã đến thăm",
    value: PROCESS_STATUS.VISITED
  }])

onMounted(async ()=>{
  onSearch(1);
})

function updateBooking(data){
  updateDialogState.value = true;
  dataUpdate.value = data;
}

function updateProcess(data){
  updateProcessDialogState.value = true;
  dataUpdateProcess.value = data;
}

function deleteBooking(data){
  deleteDialogState.value = true;
  dataDelete.value = data;
}

async function onSearch(page){
  currentPage.value=page
  let res = await getBookingsPaging(STATUS_ACTIVED,data.selectBookingProcessStatus.value,data.keyword,page,perPage.value);
  let resCount = await getCountBookingsPaging(STATUS_ACTIVED,data.selectBookingProcessStatus.value,data.keyword);
  if(res && res.data)
    bookings.value = res.data.map(booking=>{
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


