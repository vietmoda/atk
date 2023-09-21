<template>
  <v-list-item
    class="vertical-nav-menu-link"
    active-class="bg-gradient-primary text-white"
  >
    <div class="d-flex flex-row">
      <v-icon class="mr-2" >{{ icon|| "mdi-vuetify"}}</v-icon>
      <v-list-item-title>
        {{ title || "Không có tiêu đề" }}
      </v-list-item-title>
    </div>
  </v-list-item>
</template>

<script setup>
const props = defineProps({
  title: String,
  icon: String,
})
</script>


<style lang="scss" scoped>
.vertical-nav-menu-link {
  &.v-list-item--active {
    box-shadow: 0 5px 10px -4px rgba(15, 83, 185, 0.3);
  }
}
.bg-gradient-primary {
  background: $bg-gradient-primary !important;
}

.v-list-item-title {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: normal;
}
</style>
