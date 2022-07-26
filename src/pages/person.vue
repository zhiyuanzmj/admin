<template>
  <router-view />
</template>

<route lang="yaml">
redirect: /person/staff
component: ~/layouts/default.vue
meta:
  icon: i-ep:user
  title: 人员管理
</route>
