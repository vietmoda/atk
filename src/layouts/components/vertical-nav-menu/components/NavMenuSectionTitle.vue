<template>
  <div class="sub-header">
    <span class="title-wrapper">
      <span v-if="!isDrawerMenuMini">{{ title }}</span>
    </span>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app.store';
import { storeToRefs } from 'pinia';

const { isDrawerMenuMini } = storeToRefs(useAppStore());

const props = defineProps({
  title: String,
})
</script>

<style lang="scss" scoped>
.sub-header .title-wrapper {
  width: 100%;
  position: absolute;
  left: 0;
  border-bottom: 1px solid rgba(0, 0, 0, .14);
  line-height: .1em;
}

.sub-header {
  align-: center;
  display: flex;
  height: 32px;
  font-size: 0.875rem;
  font-weight: 400;
  padding: 0 16px 0 16px;
  white-space: nowrap;
  position: relative;
}

.sub-header .title-wrapper span {
  background: #EEEEEE;
  padding: 0 10px;
  font-size: 0.82rem;
  margin-left: 16px;
  color: $nav-menu-section-title;
  text-transform: uppercase;
}
</style>
