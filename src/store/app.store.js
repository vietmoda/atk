// Utilities
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
const toast = useToast();

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    miniLoading: false,
    notification: {
      active: false,
      message: "Nội dung thông báo mặc định"
    },
    isMiniMenu: false,
    openDialog: false
  }),
  getters: {
    isLoading: state => state?.loading || false,
    hasNotification: state => state?.notification?.active || false,
    notificationContent: state => state?.notification?.message || "",
    isDrawerMenuMini: state => state?.isMiniMenu || false,
    isOpenDialog: state => state?.openDialog || false,
    isMiniLoading: state => state?.miniLoading || false
  },
  actions: {
    showLoadingAction() {
      this.loading = true;
    },
    hideLoadingAction() {
      this.loading = false;
    },
    showErrorAlert(content = "Đã có lỗi") {
      toast.error(content);
    },
    showSuccessAlert(content = "Thành công rồi") {
      toast.success(content);
    },
    showWaringAlert(content = "Có một cảnh báo") {
      toast.warning(content);
    },
    showNotification(){
      this.showNotification = true;
    },
    hideNotification() {
      this.showNotification = false;
    },
    toggleDrawerMenu() {
      this.isMiniMenu = !this.isMiniMenu;
    },
    showDialog(isShow) {
      this.openDialog = isShow;
    },
    showMiniLoading() {
      this.miniLoading = true;
    },
    hideMiniLoading() {
      this.miniLoading = false;
    }
  }
})

