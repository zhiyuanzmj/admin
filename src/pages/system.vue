<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /system/user
meta:
  permission: true
  class: ic:baseline-settings
  title: 系统管理
</route>
