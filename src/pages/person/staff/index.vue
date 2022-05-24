<script setup lang="ts" name="person-staff">
import { getUserList } from './api'

async function getList() {
  await getUserList()
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
