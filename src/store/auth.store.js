import { defineStore } from 'pinia';
import { login } from '@/apis/modules/auth.api';
import { useAppStore } from './app.store';
import md5 from 'md5';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: undefined,
    userInfo: {
      status: true,
      userName: "Administrator",
      roleName: "Quản trị viên"
    }
  }),
  getters: {
    appActiveUser: state => state?.userInfo,
    isUserLoggedIn: () => {
      // Check accessToken
      const accessToken = localStorage.getItem("accessToken");
      return !!accessToken;
    } 
  },
  actions: {
    async logInAction(user, isRemember = false) {
      const {message, data, token, error} = await login(user);
      if(token) {
        // Set accessToken
        localStorage.setItem("accessToken", token);
        this.accessToken = token;
        // Save User info
        const userFullInfo = JSON.parse(localStorage.getItem("userInfo")) || this.userInfo;
        for (const property of Object.keys(data)) {
          if (data[property] !== null) {
            // If some of user property is null - user default property defined in state.userInfo
            this.userInfo[property] = data[property];
            // Update key in localStorage
            userFullInfo[property] = data[property];
          }
        }
        localStorage.setItem("userInfo", JSON.stringify(userFullInfo));
        // Lưu thông tin đăng nhập.
        if(isRemember) {
          localStorage.setItem("loginInfo", JSON.stringify(user))
        } else {
          localStorage.removeItem("loginInfo");
        }

        // Navigate User to homepage
        this.$router.push("/");
      } else {
        throw {message, error};
      }
    },
    logOutAction() {
      const { showLoadingAction, hideLoadingAction } = useAppStore();
      showLoadingAction();
      // Clean storage
      if (localStorage.getItem("accessToken")) {
        localStorage.removeItem("accessToken");
      }
      localStorage.removeItem("userInfo");
      this.accessToken = undefined;
      // Redirect to login page
      setTimeout(() => {
        hideLoadingAction();
        this.$router.push("/auth/login");
      }, 300);
    }
  }
})