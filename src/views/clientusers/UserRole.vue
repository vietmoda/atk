<template>
  <my-dialog 
    v-model="props.isShow" title="Danh sách quyền" width="900" v-on:dismiss="emit('update:isShow', false)">
    <template #content>
      <v-form v-model="isValid" ref="form" class="group-role-create">
        <vue-good-table
          ref="someTable"
          :columns="columns"
          :rows="roles"
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
  import { updateUser } from '@/apis/modules/users.api';
  import { getRoles } from '@/apis/modules/roles.api';
  import { useAppStore } from '@/store/app.store';

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
    data: Object
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const userRole = ref();
  const form = ref(null);
  const columns = ref([
    {
      label: "Tên quyền",
      field: "rolename",
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
  const roles = ref([])
  

  onUpdated(async () => {
    let res = await getRoles()
    roles.value = res.data.map(role=>{
      return{
        ...role,
        check_role: false
      }
      
    })
    //Xử lý check quyền chỉnh sửa
    if(userRole.value && userRole.value.roleid){
      userRole.value.roleid.map(id=>{
        let index = roles.value.findIndex((c) => c._id == id);
        if (index > -1) {
          roles.value[index].check_role = !roles.value[index].check_role;
        }
      })
    }
  })

  watch(() => props.data, (selection, prevSelection) => {
    userRole.value = {...props.data};
  });

  function checkRole(id) {
    let index = this.roles.findIndex((c) => c._id === id);
    if (index > -1) {
    this.roles[index].check_role = !this.roles[index].check_role;
    return;
    }
  }
  async function save(){
    try {
      let arrRole = roles.value.filter(role=> role.check_role == true).map(role=>role._id)

      let user = {
        _id: userRole.value._id,
        roleid: arrRole
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
