<script setup lang="ts">
import { getUserList } from './api'

async function getList() {
  const a = await getUserList()
  console.log(a)
}
getList()
</script>

<template>
  <div>{{ $route.meta.title }}</div>
</template>

<route lang="yaml">
meta:
  title: 人员信息
</route>
