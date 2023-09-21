<template>
  <my-dialog 
    v-model="props.isShow" title="Danh sách nhóm quyền" width="900" v-on:dismiss="emit('update:isShow', false)">
    <template #content>
      <v-form v-model="isValid" ref="form" class="group-role-create">
        <vue-good-table
          ref="someTable"
          :columns="columns"
          :rows="groupRoles"
          max-height="450px"
          :fixed-header="true"
          :sort-options="{
          enabled: false
          }"
        >
          <template #table-row="props">
            <div v-if="props.column.field === 'action'" >
              <v-checkbox
                :model-value="props.row.check_role"
                @click="checkRole(props.row._id)"
                color="success"
              ></v-checkbox>
            </div>
          </template>
        </vue-good-table>
      </v-form>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import {defineProps, defineEmits, reactive, ref, onUpdated, watch } from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import { getGroupRole } from '@/apis/modules/grouproles.api';
  import { updateUser } from '@/apis/modules/users.api';
  import { useAppStore } from '@/store/app.store';

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
    data: Object
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const userGroupRole = ref();
  const form = ref(null);
  const columns = ref([
    {
      label: "Tên nhóm quyền",
      field: "groupname",
      thClass:"text-center"
    },
    {
      label: "Chọn",
      field: "action",
      width: '100px',
      thClass:"text-center",
      tdClass:"text-center"
    }
    ])
  const groupRoles = ref([])

  onUpdated(async () => {
    let res = await getGroupRole(1);

    groupRoles.value = res.data.map(role=>{
      return{
        ...role,
        check_role: false
      }
      
    })
    //Xử lý check quyền chỉnh sửa
    if(userGroupRole.value && userGroupRole.value.grouproleid){
      userGroupRole.value.grouproleid.map(id=>{
        let index = groupRoles.value.findIndex((c) => c._id == id);
        if (index > -1) {
          groupRoles.value[index].check_role = !groupRoles.value[index].check_role;
        }
      })
    }
  })

  watch(() => props.data, (selection, prevSelection) => {
    userGroupRole.value = {...props.data};
  });

  function checkRole(id) {
    let index = this.groupRoles.findIndex((c) => c._id === id);
    if (index > -1) {
    this.groupRoles[index].check_role = !this.groupRoles[index].check_role;
    return;
    }
  }
  async function save(){
    try {
      let arrRole = groupRoles.value.filter(role=> role.check_role == true).map(role=>role._id)

      let user = {
        _id: userGroupRole.value._id,
        grouproleid: arrRole
      }
      //save
      let res = await updateUser(user);
      if (res.error == "0"){
        showSuccessAlert(res.message)
        emit('update:isShow', false);
        emit('done');
      }
      else
        showErrorAlert(res.message)
    }
    catch (error) {
      const {message} = error;
      showErrorAlert(message)
    } finally {
    }
  }
</script>
