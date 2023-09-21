<!--=========================================================================================
  Layout có sideBar Menu và content
==========================================================================================-->
<template>
  <v-app>
    <!-- Left Menu-->
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen" v-on:update-drawer-open="isDrawerOpen = !isDrawerOpen" />
    <!-- App Bar -->
    <app-header :drawer-open="isDrawerOpen" v-on:change-drawer-open=" isDrawerOpen = !isDrawerOpen"/>
    <!-- Body content -->
    <v-main>
      <my-notification/>
      <div class="app-content-container boxed-container pa-6">
        <slot></slot>
      </div>
    </v-main>
    <app-footer/>
    <loading-overlay/>
  </v-app>
</template>

<script setup>
  import AppHeader from '../components/Header.vue';
  import VerticalNavMenu from '../components/vertical-nav-menu/VerticalNavMenu.vue';
  import AppFooter from '../components/Footer.vue';
  import LoadingOverlay from '@/components/LoadingOverlay.vue';
  import MyNotification from '@/components/Notification.vue';
  import {ref} from 'vue';

  const isDrawerOpen = ref(null);
</script>
