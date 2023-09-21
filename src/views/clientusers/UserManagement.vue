<template>
  <v-card class="mb-5 card-search">
    <v-toolbar class="title mb-3" color="primary" title="Danh sách tài khoản khách hàng"></v-toolbar>
    <v-card-subtitle>Danh sách toàn bộ người dùng khách hàng trên hệ thống. Bạn có thể thêm mới, sửa, xóa và cập nhật tài
      khoản</v-card-subtitle>
    <v-card-actions>
      <v-btn variant="outlined" size="small" color="primary" @click="createDialogState = true" class="mt-3">Thêm
        mới</v-btn>
    </v-card-actions>
  </v-card>
  <!-- <FilePickerDialog v-model:is-show="upload" @upload:finished="uploadDone"/> -->
  <v-card :loading="isMiniLoading" class="pa-0">
    <!-- Table danh sách người dùng -->
    <vue-good-table compactMode ref="someTable" :columns="columns" :rows="users" :line-numbers="false" :loading="loading"
      :sort-options="{
        enabled: false
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
        <div v-if="props.column.field === 'avatar'">
          <v-avatar><v-img width="50" height="50" lazy-src="@/assets/images/no-avatar.png"
              src="@/assets/images/no-avatar.png"></v-img></v-avatar>
        </div>
        <div v-if="props.column.field === 'status'" class="center">
          <v-badge v-if="props.row.status == 1" content="Hoạt động" color="success" inline></v-badge>
          <v-badge v-else content="Không hoạt động" color="warning" inline></v-badge>
        </div>
        <div v-if="props.column.field === 'organizationid'">
          {{ organizations.find(o => o.value == Number(props.row?.organizationid))?.label }}
        </div>
        <div v-if="props.column.field === 'action'">
          <div class="d-flex justify-center">
            <v-btn @click="updateUser(props.row)" v-bind="props" variant="outlined" size="x-small" color="primary"
              class="mx-1" icon="mdi-pencil">
              <v-icon color="primary">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Cập nhật thông tin tài khoản</v-tooltip>
            </v-btn>
            <v-btn @click="updateUserRole(props.row)" variant="outlined" size="x-small" color="warning" class="mx-1"
              icon="mdi-shield-account">
              <v-icon color="warning">mdi-shield-account</v-icon>
              <v-tooltip activator="parent" location="top">Cập nhật quyền cho tài khoản</v-tooltip>
            </v-btn>
            <v-btn @click="updateUserGroupRole(props.row)" variant="outlined" size="x-small" color="warning" class="mx-1"
              icon="mdi-shield-account-variant">
              <v-icon color="warning">mdi-shield-account-variant</v-icon>
              <v-tooltip activator="parent" location="top">Cập nhật nhóm quyền cho tài khoản</v-tooltip>
            </v-btn>
            <v-btn @click="deleteUser(props.row)" variant="outlined" size="x-small" color="error" class="mx-1"
              icon="mdi-delete">
              <v-icon color="error">mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">Xóa tài khoản khỏi hệ thống</v-tooltip>
            </v-btn>
          </div>
        </div>
      </template>
    </vue-good-table>
  </v-card>
  <user-create v-model:is-show="createDialogState" v-on:done="onSearch" />
  <user-update v-model:is-show="updateDialogState" :data="userDataUpdate" v-on:done="onSearch" />
  <user-delete v-model:is-show="deleteDialogState" :user="userDataDelete" v-on:done="onSearch" />
  <UserRole v-model:is-show="updateRoleDialogState" :data="userRoleDataUpdate" v-on:done="onSearch" />
  <UserGroupRole v-model:is-show="updateGroupRoleDialogState" :data="userGroupRoleDataUpdate" v-on:done="onSearch" />
</template>

<script setup>
import UserCreate from './UserCreate.vue';
import UserUpdate from './UserUpdate.vue';
import UserDelete from './UserDelete.vue';
import UserRole from './UserRole.vue';
import UserGroupRole from './UserGroupRole.vue';
import { reactive, ref, onMounted } from 'vue';
import { getUsers } from '@/apis/modules/users.api';
import { useAppStore } from '@/store/app.store';
import { storeToRefs } from 'pinia';
import { useDropdownStore } from '@/store/dropdown.store';
const { showMiniLoading, hideMiniLoading } = useAppStore();
const { isMiniLoading } = storeToRefs(useAppStore());

const { organizations } = useDropdownStore();

const columns = reactive([
  {
    label: '',
    field: 'avatar',
    width: "50px",
    tdClass: 'center'
  },
  {
    label: "Tên người dùng khách hàng",
    field: "fullname",
    thClass: "text-center",
  },
  {
    label: "Tài khoản khách hàng",
    field: "username",
    thClass: "text-center"
  },
  {
    label: "Trạng thái",
    field: "status",
    width: '150px',
    thClass: "text-center",
    tdClass: "text-center"
  },
  {
    label: "Thao tác",
    field: "action",
    width: '150px',
    thClass: "text-center",
    tdClass: "text-center"
  },
])
const createDialogState = ref(false);
const updateDialogState = ref(false);
const deleteDialogState = ref(false);
const updateRoleDialogState = ref(false);
const updateGroupRoleDialogState = ref(false);
const userDataUpdate = ref(null);
const userRoleDataUpdate = ref(null);
const userGroupRoleDataUpdate = ref(null);
const userDataDelete = ref(null);

const serverParams = reactive({
  page: 1,
  limit: 10
});
const users = ref([]);
const loading = ref(false);

onMounted(async () => onSearch());

async function onSearch() {
  showMiniLoading();
  try {
    users.value = (await getUsers(serverParams))?.data || [];
  } catch (error) {
    users.value = [];
  } finally {
    hideMiniLoading()
  }
}

function updateUser(dataUpdate) {
  updateDialogState.value = true;
  userDataUpdate.value = dataUpdate;
}

function updateUserRole(dataUpdate) {
  updateRoleDialogState.value = true;
  userRoleDataUpdate.value = dataUpdate;
}

function updateUserGroupRole(dataUpdate) {
  updateGroupRoleDialogState.value = true;
  userGroupRoleDataUpdate.value = dataUpdate;
}

function deleteUser(user) {
  deleteDialogState.value = true;
  userDataDelete.value = user;
}

/* const upload= ref(false);
function uploadDone(data) {
  console.log(data)
}
 */
</script>

<style lang="scss" scoped></style>