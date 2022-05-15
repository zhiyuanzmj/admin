<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import VItem from './VItem.vue'
import routes from '~pages'
const getList = (list: RouteRecordRaw[]) =>
  list.filter((i) => {
    i.children && (i.children = getList(i.children))
    return !i.meta?.hidden
  })
const list = computed(() => getList(cloneDeep(routes)))
</script>

<template>
  <el-menu router :default-active="$route.path" b-r-none="!" overflow-auto>
    <VItem :key="$route.path" :list="list" />
  </el-menu>
</template>
