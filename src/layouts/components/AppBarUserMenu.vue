<template>
  <v-menu
    offset-y
    left
    nudge-bottom="14"
    min-width="230"
    class="user-profile-menu-content"
  >
    <template v-slot:activator="{ props, on }">
      <v-btn
        icon
        v-bind="props"
        class="ms-3 mr-3"
      >
        <v-badge
          bottom
          color="success"
          overlap
          offset-x="3"
          offset-y="3"
          dot
        >
          <v-avatar size="40px" v-bind="props">
            <v-img src="@/assets/images/no-avatar.png"></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <div class="d-flex flex-row">
          <v-badge
            bottom
            color="success"
            overlap
            offset-x="3"
            offset-y="3"
            class="mr-2"
            dot
          >
            <v-avatar size="40px">
              <v-img src="@/assets/images/no-avatar.png"></v-img>
            </v-avatar>
          </v-badge>
          <v-list-item-title>
            <div
              class="d-inline-flex flex-column justify-center ms-3"
              style="vertical-align:middle"
            >
              <span class="font-weight-bold mb-n1"> {{ fullname }}</span>
              <small class="text-grey">{{ roleName}}</small>
            </div>
          </v-list-item-title>
        </div>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <div class="d-flex flex-row">
          <v-icon class="mr-2">mdi-account-eye</v-icon>
          <v-list-item-title> Thông tin tài khoản </v-list-item-title>
        </div>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="logOutAction">
        <div class="d-flex flex-row">
          <v-icon class="mr-2">mdi-logout-variant</v-icon>
          <v-list-item-title> Đăng xuất </v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.store';
const { appActiveUser: defaultInfo } = useAuthStore();
const { logOutAction } = useAuthStore();

const appActiveUser = JSON.parse(localStorage.getItem("userInfo"));
const {fullname = defaultInfo?.userName, roleName = defaultInfo?.roleName} = appActiveUser;

</script>

<style lang="scss">
</style>
