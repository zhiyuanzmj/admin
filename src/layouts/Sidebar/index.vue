<script setup lang="ts">
import VItem from './VItem.vue'
import { useRouteStore } from '~/stores/route'
const routeStore = useRouteStore()
</script>

<template>
  <el-menu :default-active="$route.path" b-r-none="!" overflow-auto>
    <VItem :key="$route.path" :list="routeStore.list" />
  </el-menu>
</template>

<style scoped>
::v-deep(.el-menu-item.is-active) {
  background: linear-gradient(to left, #60a5fa 2%, transparent 2%);

  @apply bg-blue-50 dark:bg-gray-800;
}
</style>
