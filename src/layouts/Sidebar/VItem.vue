<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
// import { useRoute } from 'vue-router'
// import { updateViewKey } from '../index.vue'
// import useTagsview, { resolve } from '~/store/useTagsview'
defineProps<{ list: RouteRecordRaw[] }>()
// const route = useRoute()
// const updateView = inject(updateViewKey)
// function clickHandler(view: RouteRecordRaw) {
//   if (resolve(view.path) === resolve(route.path))
//     updateView?.()
// }

// const tagsView = useTagsview()
</script>

<template>
  <template v-for="i in list" :key="i.path">
    <el-sub-menu v-if="i.children?.length" :index="$router.resolve(i)?.path">
      <template #title>
        <el-icon :class="i.meta?.class" />
        <span>{{ i.meta?.title }}</span>
      </template>
      <VItem :list="i.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="$router.resolve(i)?.path">
      <el-icon :class="i.meta?.class" />
      {{ i.meta?.title }}
    </el-menu-item>
  </template>
</template>
