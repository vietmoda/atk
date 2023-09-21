<template>
  <component :is="resolveLayout">
    <router-view v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <div :key="route.name" class="layout-container">  
          <component :is="Component"></component>
        </div>
      </Transition>
    </router-view>
  </component>
</template>

<script>
  import LayoutBlank from '@/layouts/default/Blank.vue';
  import LayoutMain from '@/layouts/admin/Main.vue';
  import { computed } from 'vue';
  import { useRouter } from '@/utils'

  export default {
    components: {
      LayoutBlank,
      LayoutMain
    },
    setup() {
      const { route } = useRouter();
      const resolveLayout = computed(() => {
        // Handles initial route
        if (route.value.name === undefined) return null;
        if (route.value.meta.layout === 'blank') return LayoutBlank;
        return LayoutMain;
      });
      return {
        resolveLayout,
      }
    }
  }
</script>
<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>