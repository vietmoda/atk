<template>
<v-row class="gallery center">
    <v-col
      v-for="image in images"
      :key="image._id"
      class="d-flex child-flex"
      cols="3"
    >
      <v-img
        :src="image?.fileurl || 'src/assets/images/no-image.png'"        
        class="bg-grey-lighten-2 image"
      >
      <v-btn v-if="isRemove" @click="$emit('removeImage',image)" variant="outlined" size="x-small" color="error" class="remove">
          <v-icon color="error">mdi-close</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >Xóa ảnh</v-tooltip>
        </v-btn>
      </v-img>
    </v-col>
  </v-row>
</template>

<script setup>
  import {defineProps} from 'vue'
  const props = defineProps({
    images: Object,
    isRemove: {type:Boolean, default:false}
  })
</script>

<style scoped>
.gallery{
  margin: 0 auto;
}
.image{
  max-height: 200px;
}
img{
  width: 100%;
  display: block;
  /* filter: grayscale(); */
}
img:hover{
  filter: none;
}
.remove{
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 28px;
  font-weight: 700;

  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  color: #000000;
}
</style>