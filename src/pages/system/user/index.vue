<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <div>{{ name }}</div>
</template>

<route lang="yaml">
meta:
  title: 用户管理
</route>
