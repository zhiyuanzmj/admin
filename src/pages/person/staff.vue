<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<route lang="yaml">
redirect: /person/staff
meta:
  title: 人员信息
  order: 1
</route>
