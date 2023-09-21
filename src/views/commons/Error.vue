<template>
  <!-- background triangle shape  -->
  <!-- Body login form -->
  <div class="login-container align-center justify-center d-flex fill-height">
    <v-container>
      <div class="center">
        <v-card-title class="d-flex align-center justify-center py-7">
          <div class="d-flex align-center">
            <v-img
              contain
              width="350"
              src="@/assets/images/404.png"
            />
          </div>
        </v-card-title>
        <v-card-text class="text-center">
          <p class="text-h4 font-weight-bold text-error mb-2">
            Trang không tồn tại
          </p>
          <p class="mb-3">
            Nếu cần hỗ trợ, vui lòng liên hệ với bộ phận kỹ thuật.
          </p>
          <v-divider/>
          <v-btn color="primary" class="mt-3" href="/">
            <v-icon
              icon="mdi-home"
              size="large"
              start
            />
            Quay về trang chủ
          </v-btn>
        </v-card-text>
      </div>
    </v-container>
</div>
</template>

<style lang="scss" scoped>
.center{
  padding: 0.9375rem 0.875rem;
  max-width: 32rem;
  margin: 0 auto;
  z-index: 1;
}
</style>
