<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới nhóm quyền" width="900" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form" class="group-role-create">
        <v-text-field
          v-model="groupRole.groupname"
          outlined
          label="Tên nhóm quyền"
          placeholder="Nhập nhóm quyền"
          variant="outlined"
          type="input"
          clearable
          hint="Nhập tên nhóm quyền"
          class="mb-5"
          :rules="validator.groupRoleName">
        </v-text-field>
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
            <div v-if="props.column.field === 'action'">
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
  import {reactive, ref, onUpdated} from 'vue'
  import MyDialog from '@/components/Dialog.vue';
  import { createGroupRole } from '@/apis/modules/grouproles.api';
  import { getRoles } from '@/apis/modules/roles.api';
  import { useAppStore } from '@/store/app.store';
  import { STATUS_ACTIVED } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const groupRole = reactive({
    groupname: "", 
    listroleid: "",
    status: STATUS_ACTIVED
  });
  const form = ref(null);
  const loading = ref(false);
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
  const isValid = ref(false);
  const validator =  ref({
    groupRoleName : [
    value => !!value || 'Không được để trống thông tin',
    //value => (value || '').length <= 20 || 'Max 20 characters',
    ]})

  onUpdated(async () => {
    let res = await getRoles()
    roles.value = res.data.map(role=>{
      return{
        ...role,
        check_role: false
      }
      
    })
  })

  function checkRole(id) {
    let index = this.roles.findIndex((c) => c._id === id);
    if (index > -1) {
    this.roles[index].check_role = !this.roles[index].check_role;
    return;
    }
  }

  async function save(){
    await form.value.validate();

    if(isValid.value) {
      loading.value = true;
      try {
        let arrRole = roles.value.filter(role=> role.check_role == true).map(role=>role._id)
        groupRole.listroleid = arrRole

        //save
        let res = await createGroupRole(groupRole);
        if (res.error == "0"){
          showSuccessAlert(res.message)
          //close dialog
          emit('update:isShow', false)
          emit('done');
        }
        else
          showErrorAlert(res.message)
      }
      catch (error) {
        const {message} = error;
        showErrorAlert(message)
      } finally {
        loading.value = false;
      }
    }
  }

</script>