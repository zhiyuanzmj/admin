<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useTagsviewStore } from '~/stores/tagsview'
defineProps<{ list: RouteRecordRaw[] }>()

const tagsView = useTagsviewStore()
</script>

<template>
  <template v-for="i in list" :key="i.path">
    <el-sub-menu v-if="i.children?.length" :index="$router.resolve(i).path">
      <template #title>
        <el-icon :class="i.meta?.icon" />
        <span>{{ i.meta?.title }}</span>
      </template>
      <VItem :list="i.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="$router.resolve(i).path" @click="tagsView.push(i.name)">
      <el-icon :class="i.meta?.icon" />
      {{ i.meta?.title }}
    </el-menu-item>
  </template>
</template>
