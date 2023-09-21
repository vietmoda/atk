<template>
  <v-card class="greeting-card pa-2" color="primary">
    <v-row class="ma-0 pa-0" style="height: 130px">
      <v-col cols="9">
        <v-card-title class="text-white font-weight-bold text-no-wrap pt-1 ps-2">
          Xin chào {{ appActiveUser?.fullname }} 🥳
        </v-card-title>
        <v-card-subtitle class="text-white text-no-wrap ps-2">
          Chúc bạn một ngày mới vui vẻ
        </v-card-subtitle>
        <v-card-text class="d-flex align-center mt-2 pb-2 ps-2">
          <v-btn small color="white">Thêm tài khoản</v-btn>
        </v-card-text>
      </v-col>
      <v-col cols="3">
        <v-img
          max-width="80"
          class="greeting-card-trophy"
          src="@/assets/images/logo-white.png"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const appActiveUser = JSON.parse(localStorage.getItem("userInfo")) 

</script>

<style lang="scss" scoped>
.greeting-card {
  position: relative;
  background: linear-gradient(90deg, $color-primary  0%, #00cdac 100%) !important;
  
  .greeting-card-bg {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>