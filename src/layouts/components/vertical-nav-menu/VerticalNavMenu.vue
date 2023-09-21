<template>
  <v-navigation-drawer :model-value="isDrawerOpen" :rail="isDrawerMenuMini" app floating width="260"
    class="myapp-navigation-menu" @update:modelValue="val => emit('update-drawer-open', !val)">

    <!-- Navigation Header -->
    <div v-if="!isDrawerMenuMini" class="vertical-nav-header d-flex -center pt-5 pb-2">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-img src="@/assets/images/logo-vnpt-new.png" height="50px" width="150px" alt="logo" contain eager
          class="app-logo me-3"></v-img>
      </router-link>
    </div>
    <router-link v-else to="/" class="d-flex align-center text-decoration-none pt-3 pb-2">
      <v-avatar size="60px">
        <v-img src="https://brademar.com/wp-content/uploads/2022/09/VNPT-Logo-PNG-3.png" height="60px" width="150px"
          alt="logo"></v-img>
      </v-avatar>
    </router-link>
    <v-divider />
    <!-- Navigation  -->
    <nav-menu-group v-for="(group, index) in json" v-bind:key="index" :group-title="group.groupTitle"
      :children-menu="group.childrenMenu" />
  </v-navigation-drawer>
</template>

<script setup>
import NavMenuGroup from './components/NavMenuGroup.vue';
// Dummy menu. Thực tế sẽ lấy danh sách menu từ store (khi người dùng đăng nhập sẽ có dữ liệu này)
import json from './vertical-nav-menu.json';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app.store';

const { isDrawerMenuMini } = storeToRefs(useAppStore());
const { toggleDrawerMenu } = useAppStore();

const props = defineProps({
  isDrawerOpen: Boolean
});

const emit = defineEmits(['update-drawer-open'])

</script>

<style>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

.app-logo {
  transition: all 0.18s ease-in-out;
}

.myapp-navigation-menu {
  background: #EEEEEE !important;
}
</style>