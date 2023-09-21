import { defineStore } from 'pinia';
import { useAppStore } from './app.store';
import { addUser, updateUser, deleteUser } from '@/apis/modules/users.api';

export const useUserStore = defineStore('users', {
  
  state: () => ({

  }),
  actions: {
    async addUserAction(user) {
      const { showLoadingAction, hideLoadingAction, showErrorAlert } = useAppStore();
      user = {
        ...user,
        position: user?.position?.label,
        organizationid: user?.organizationid?.value,
        status: Number(user?.status) || 0
      }
      // Xóa thuộc tính dữ liệu không cần thiết
      delete user['passwordConfirm'];
      showLoadingAction();
      try {
        await addUser(user);
      } catch (error) {
        const {message} = error;
        showErrorAlert(message);
      } finally {
        hideLoadingAction();
      }
    },
    async updateUserAction(user) {
      const { showLoadingAction, hideLoadingAction, showErrorAlert } = useAppStore();
      user = {
        ...user,
        status: Number(user?.status) || 0,
        position: user?.position?.label,
        organizationid: user?.organizationid?.value,
      }
      
      // Xóa thuộc tính dữ liệu không cần thiết
      delete user['passwordConfirm'];
      console.log(user)
      showLoadingAction();
      try {
        await updateUser(user);
      } catch (error) {
        const {message} = error;
        showErrorAlert(message);
      } finally {
        hideLoadingAction();
      }
    },
    async deleteUserAction(userId) {
      const { showLoadingAction, hideLoadingAction, showErrorAlert } = useAppStore();
      showLoadingAction();
      try {
        await deleteUser(userId);
      } catch (error) {
        const {message} = error;
        showErrorAlert(message);
      } finally {
        hideLoadingAction();
      }
    }
  }
})