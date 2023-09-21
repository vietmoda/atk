<template>
  <v-app>
    <v-main>
      <div class="app-content-container boxed-container fill-height">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.app-content-container:deep(.layout-container) {
  height: 100%;
}
</style>
