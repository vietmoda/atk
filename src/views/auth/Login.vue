<template>
  <!-- background triangle shape  -->
  <div class="background"/>
  <!-- Body login form -->
  <div class="login-container align-center justify-center d-flex fill-height">
    <v-container>
      <v-card class="auth-card">
        <v-card-title class="d-flex align-center justify-center py-7">
          <div class="d-flex align-center">
            <v-img
              contain
              width="150"
              src="@/assets/images/logo-vnpt-new.png"
            />
          </div>
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <p class="text-h6 font-weight-bold text-primary mb-2 text-center">
            Chào mừng tới hệ thống! 👋🏻
          </p>
          <p class="mb-5 text-center">
            Vui lòng đăng nhập để bắt đầu sử dụng.
          </p>
          <v-form v-model="isValid" ref="form">
            <v-text-field
              v-model="user.username"
              outlined
              label="Tên người dùng"
              placeholder="Nhập tên người dùng"
              variant="outlined"
              type="input"
              clearable
              hint="Nhập tên người dùng để truy cập hệ thống"
              class="mb-4"
              v-on:keyup.enter="loginJWT"
              :rules="validator.usernameRules"></v-text-field>
            <v-text-field
              v-model="user.password"
              outlined
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              variant="outlined"
              type="password"
              clearable
              hint="Nhập mật khẩu để truy cập hệ thống"
              class="mb-0"
              v-on:keyup.enter="loginJWT"
              :rules="validator.passwordRules"></v-text-field>
              <!-- Ghi nhớ đăng nhập -->
              <div class="d-flex d-flex-row justify-end">
                <v-checkbox
                  v-model="isRememberInfo"
                  :model-value="isRememberInfo"
                  label="Ghi nhớ đăng nhập"
                  color="primary"
                  hide-details
                  class="wrap-width"
                  @change="rememberLoginOnChange"
                ></v-checkbox>
              </div>
            <v-btn block color="primary" class="mt-6" @click="loginJWT" :loading="loading">
              Đăng nhập
            </v-btn>
          </v-form>
        </v-card-text>
        <v-divider/>
        <!-- create new account  -->
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2">
            Bạn chưa có tài khoản?
          </span>
          <router-link to="/" class="text-primary text-decoration-none" target="_blank">
            Liên hệ cấp tài khoản
          </router-link>
        </v-card-text>
      </v-card>
    </v-container>
  <!-- Checking login or not -->
  <!-- <div v-else class="centered-screen" >
    <span class="waiting-text"><span class="animate-flicker">🚀</span> Đang kiểm tra...</span>
  </div> -->
</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store/app.store';

const { logInAction } = useAuthStore();
const { isUserLoggedIn } = useAuthStore();
const { showErrorAlert } = useAppStore();

const validator = ref({
  usernameRules: [v => (!!v && v.length >= 4) || 'Tên người dùng là bắt buộc và có độ dài tối thiểu hơn 4 ký tự'],
  passwordRules:[v => (!!v && v.length >= 6) || 'Mật khẩu là bắt buộc và có độ dài tối thiểu hơn 6 ký tự']
});
const isValid = ref(false);
const user = reactive({
  username: JSON.parse(localStorage.getItem("loginInfo"))?.username || "", 
  password: JSON.parse(localStorage.getItem("loginInfo"))?.password || ""
});
const form = ref(null);
const loading = ref(false);

const isRememberInfo = ref(JSON.parse(localStorage.getItem("activeRememberInfo")) === true || false);
async function loginJWT() {
  // Thực hiện validate một lần trước khi gọi login request.
  await form.value.validate();
  if(isValid.value) {
    loading.value = true;
    // make to login request
    try {
      const body = {
        username: user.username?.trim(),
        password: user.password?.trim()
      }
      await logInAction(body, isRememberInfo.value);
    } catch (error) {
      const {message} = error;
      showErrorAlert(message)
    } finally {
      loading.value = false;
    }
  }
}

function rememberLoginOnChange() {
  localStorage.setItem("activeRememberInfo", isRememberInfo.value || false);
  if(!isRememberInfo.value) {
    localStorage.removeItem("loginInfo");
  }
}
</script>

<style lang="scss" scoped>
.login-container:deep(.v-checkbox .v-selection-control ) {
  min-height: 40px;
}
.wrap-width{
  flex: inherit;
}
.waiting-text {
  font-size: 20;
}
.auth-card {
  padding: 0.9375rem 0.875rem;
  max-width: 32rem;
  margin: 0 auto;
  z-index: 1;
}
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url('@/assets/images/login-bg.jpg') no-repeat center center;
  background-size: cover;
  background-color: #FFFFFF;
  z-index: 0;
}
@keyframes flickerAnimation {
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}
@-o-keyframes flickerAnimation{
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}
@-moz-keyframes flickerAnimation{
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}
@-webkit-keyframes flickerAnimation{
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}
.animate-flicker {
   -webkit-animation: flickerAnimation 1s infinite;
   -moz-animation: flickerAnimation 1s infinite;
   -o-animation: flickerAnimation 1s infinite;
    animation: flickerAnimation 1s infinite;
}
.app-content-container:deep(div) {
  height: 100%;
}
</style>
