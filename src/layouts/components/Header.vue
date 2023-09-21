<template>
  <v-app-bar absolute>
    <v-app-bar-nav-icon
      class="d-block d-lg-none me-2"
      @click="val => emit('change-drawer-open', !val)"
    ></v-app-bar-nav-icon>
    <v-app-bar-title>
      <v-btn icon="mdi-menu" class="header-toggler" @click="toggleDrawerMenu"/>
      <v-btn icon="mdi-home" href="http://thainguyen.vnpt.vn" target="_blank"/>
      <v-btn icon="mdi-facebook" href="https://www.facebook.com" target="_blank"/>
      <v-btn icon="mdi-youtube" href="https://youtube.com" target="_blank"/>
    </v-app-bar-title>
    <div class="d-none d-lg-block">
      <div
        class="d-inline-flex flex-column justify-center ms-3"
        style="vertical-align:middle"
      >
        <span class="text--primary font-weight-bold mb-n1">
          {{ fullname }}
        </span>
        <small class="text-grey">{{roleName}}</small>
      </div>
    </div>
    <app-bar-user-menu></app-bar-user-menu>
  </v-app-bar>
</template>

<script setup>
import AppBarUserMenu from './AppBarUserMenu.vue';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store/app.store';
const { appActiveUser: defaultInfo } = useAuthStore();

const appActiveUser = JSON.parse(localStorage.getItem("userInfo"));
const {fullname = defaultInfo?.userName, roleName = defaultInfo?.roleName} = appActiveUser;

const { toggleDrawerMenu } = useAppStore();

// logic code here
const emit = defineEmits(['changeDrawerOpen']);
</script>

<style lang="scss" scoped>
// Ẩn icon điều khiển navigation drawer menu trên mobile
@media screen and (max-width: 1280px) {
  .header-toggler {
    visibility: hidden;
    clear: both;
    float: left;
    margin: 10px auto 5px 20px;
    width: 28%;
    display: none;
  }
}
</style>
