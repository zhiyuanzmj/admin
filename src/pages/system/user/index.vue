<script setup lang="ts">
</script>

<template>
  <div>{{ $route.meta.title }}</div>
</template>

<route lang="yaml">
meta:
  permission: /get/user
  title: 用户管理
</route>
