<script lang="ts">
export default {
  name: 'KeepAlive',
}
</script>

<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /food/food
meta:
  icon: ep:food
  title: 菜单管理
</route>
