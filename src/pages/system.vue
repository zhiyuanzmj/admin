<script lang="ts">
export default {
  name: 'ChildrenLayout',
}
</script>

<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /system/user
meta:
  permission: true
  icon: ep:setting
  title: 系统管理
</route>
