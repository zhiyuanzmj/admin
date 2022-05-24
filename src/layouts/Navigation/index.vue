<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { toggleDark } from '~/composables'

const show = ref(false)
const user = useUserStore()

let expand = $ref(false)
function toggleExpand() {
  expand = !expand
  expand
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen()
}
</script>

<template>
  <nav flex gap-3 items-center text-sm px-3>
    <i cursor-pointer :class="show ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'" @click="show = !show" />

    <el-breadcrumb mr-auto relative>
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <transition-group v-if="$route.path !== '/'" name="breadcrumb" appear>
        <el-breadcrumb-item v-for="(i) in $route.matched.slice(1)" :key="i.name" :to="i">
          {{ i.meta?.title }}
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>

    <button fa6-solid:magnifying-glass btn text-sm />
    <button btn text-sm fa6-solid:sun dark:fa6-solid-moon @click="toggleDark()" />
    <button btn text-sm :class="expand ? 'fa6-solid:compress' : 'fa6-solid:expand'" @click="toggleExpand" />
    <el-dropdown>
      <div flex items-center gap-1 cursor-pointer>
        <i fa6-solid:circle-user text-xl text-gray-300 mx-1 />
        admin
        <i fa-solid:sort-down self-start />
      </div>
      <template #dropdown>
        <el-dropdown-item mt="!1.5">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item divided mb="!1.5" @click="user.logout()">
          退出登陆
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </nav>
</template>

<style>
.el-breadcrumb__inner {
  font-weight: normal !important;
}

/* breadcrumb transition */
.breadcrumb-enter-active {
  transition: all 0.25s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(30px) skewX(-50deg);
}
</style>
