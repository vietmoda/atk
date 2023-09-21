<template>
  <v-footer
      app
      inset
      absolute
      height="56"
      class="px-0 app-footer d-flex justify-space-between"
    >
      <!--Left menu-->
      <div class="ms-6 d-flex justify-space-between">
        <span>
          &copy; 2023 <a
            href="http://thainguyen.vnpt.vn/"
            class="text-decoration-none"
            target="_blank"
          >VNPT Thái Nguyên</a></span>
      </div>
      <!--Right menu -->
      <div class="mx-6 d-flex justify-space-between">
        <span class="mx-3">
          <a href="http://thainguyen.vnpt.vn/" target="_blank" class="text-decoration-none">Tài liệu</a>
        </span>
        <span class="mx-3">
          <a href="http://thainguyen.vnpt.vn/" target="_blank" class="text-decoration-none">Chính sách</a>
        </span>
        <span class="mx-3">
          <a href="http://thainguyen.vnpt.vn/" target="_blank" class="text-decoration-none">Bản quyền</a>
        </span>
      </div>
    </v-footer>
</template>

<style lang="scss" scoped>
.app-footer span a{
  font-size: 15px;
  font-weight: bold;
  color: $color-primary;
}

</style>