<template>
  <my-dialog 
    v-model="props.isShow" title="Thêm mới tài khoản người dùng" v-on:dismiss="dismissDialog">
    <!-- child template -->
    <template #content>
      <v-form v-model="isValid" ref="form" lazy-validation>
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="body.username"
              label="Username"
              placeholder="Nhập tên người dùng"
              variant="outlined"
              type="input"
              clearable
              class="mr-lg-3"
              :rules="validator.usernameRules"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="body.password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu cho tài khoản mới"
              variant="outlined"
              type="password"
              clearable
              class="mx-lg-3"
              :rules="validator.passwordRules"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="body.passwordConfirm"
              label="Xác nhận lại mật khẩu"
              placeholder="Xác nhận lại mật khẩu"
              variant="outlined"
              type="password"
              clearable
              class="ml-lg-3"
              :rules="validator.passwordRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="body.fullname"
              label="Tên đầy đủ"
              placeholder="Nhập tên người dùng"
              variant="outlined"
              type="input"
              clearable
              class="mr-lg-3"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="body.email"
              label="Email"
              placeholder="Nhập Địa chỉ email"
              variant="outlined"
              type="input"
              clearable
              class="mx-lg-3"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="body.organizationid"
              clearable
              variant="outlined"
              label="Phòng ban"
              :items="organizations"
              item-title="label"
              item-value="value"
              class="ml-lg-3"
              return-object
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <v-select
              v-model="body.position"
              clearable
              variant="outlined"
              label="Chức vụ"
              :items="positions"
              item-title="label"
              item-value="value"
              class="mr-lg-3"
              return-object
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="body.address"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ chỗ ở của nhân viên"
              variant="outlined"
              type="input"
              clearable
              class="ml-lg-3"
            />
          </v-col>
        </v-row>
        <v-row>
          <div class="d-flex flex-row ml-3 w-100">
            <v-img cover width="110" height="110" :src="avatarSrc || 'src/assets/images/no-avatar.png'"></v-img>
            <div class="d-flex flex-column mx-3 w-100">
              <media-picker v-on:media-picker-upload-done="updateAvatar"/>
            </div>
          </div>
        </v-row>
        <v-switch label="Kích hoạt tài khoản" color="primary" inset v-model="body.status" hide-details class="mt-2"></v-switch>
      </v-form>
    </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
import { ref, reactive  } from 'vue';
import MyDialog from '@/components/Dialog.vue';
import MediaPicker from '@/components/MediaPicker.vue';

import { useUserStore } from '@/store/user.store';
import { useDropdownStore } from '@/store/dropdown.store';

const { addUserAction } = useUserStore();
const { organizations, positions } = useDropdownStore();

const props = defineProps({
  isShow: Boolean,
});
const emit = defineEmits(['update:isShow', 'done']);

const form = ref(null);
const isValid = ref(false);
// Giá trị khởi tạo mặc định của form thông tin tài khoản
const initialBody = {
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
  fullname: "",
  address: "",
  position: positions[0] || { label: 'Giám đốc', value: 1 },
  organizationid: organizations[0] || { label: 'Ban giám đốc', value: 1 },
  telephone: "",
  usertype: 1,
  avatar: "",
  status: true
};
const body = reactive({ ...initialBody });
const avatarSrc = ref(undefined);

const validator = reactive({
  usernameRules: [v => (!!v && v.length >= 4) || 'Tên người dùng là bắt buộc và có độ dài tối thiểu hơn 4 ký tự'],
  passwordRules:[v => (!!v && v.length >= 6) || 'Mật khẩu là bắt buộc và có độ dài tối thiểu hơn 6 ký tự'],
  emailRules: []
});

async function save() {
  await addUserAction(body);
  dismissDialog();
  emit('done');
}

function resetForm() {
  Object.assign(body, initialBody);
}

async function dismissDialog() {
  // reset validate form
  await form.value.resetValidation();
  resetForm();
  emit('update:isShow', false)
}

function updateAvatar(data) {
  console.log('updateAvatar');
  const [file] = data;
  avatarSrc.value = file?.fileurl || 'src/assets/images/no-avatar.png';
  body.avatar = file?._id
}

</script>
