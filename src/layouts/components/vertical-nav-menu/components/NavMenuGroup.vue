<template>
  <div class="nav-group-menu">
    <NavMenuSectionTitle v-if="groupTitle !== ''" :title="groupTitle"/>
  </div>
  <v-list
    expand
    shaped
    class="vertical-nav-menu-items pr-0"
  >
    <nav-menu-link
      v-for="(menu, index) in childrenMenu"
      v-bind:key="index"
      :title="menu.name"
      :to="menu.to"
      :icon="menu.icon"
    ></nav-menu-link>
  </v-list>
</template>

<script setup>
import NavMenuLink from './NavMenuLink.vue';
import NavMenuSectionTitle from './NavMenuSectionTitle.vue';

const props = defineProps({
  groupTitle: String,
  childrenMenu: Array
})
</script>


<style lang="scss">

.app-navigation-menu {
  .v-list-item {
    padding-left: 22px;
    margin-top: 0.375rem;
    height: 44px;
    min-height: 44px;


    .v-list-item__icon {
      margin-top: 0;
      margin-bottom: 0;
      align-self: center;
    }
  }
}
</style>
