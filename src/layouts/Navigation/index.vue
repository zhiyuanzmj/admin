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
  <nav flex gap-3 items-center text-sm px-3 text="gray-500 dark:gray-200">
    <i cursor-pointer :class="show ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'" @click="show = !show" />

    <div flex gap-2 mr-auto relative>
      <router-link :to="{ path: '/' }" hover:text-blue-500>
        首页
      </router-link>
      <transition-group v-if="$route.path !== '/'" name="breadcrumb">
        <span v-for="(i, index) in $route.matched.slice(1)" :key="i.name" flex items-center gap-3 last:text="gray-700 dark:gray-400">
          /
          <router-link :to="i" hover:text-blue-500="!" flex items-center>
            {{ i.meta?.title }}
            <i v-if="index === $route.matched.length - 2" fa6-solid:rotate-right text-xs ml=".5" />
          </router-link>
        </span>
      </transition-group>
    </div>

    <i fa6-solid:magnifying-glass hover:text-gray-500 cursor-pointer />
    <i hover:text-gray-500 cursor-pointer fa6-solid:sun dark:fa6-solid-moon @click="toggleDark()" />
    <i :class="expand ? 'fa6-solid:compress' : 'fa6-solid:expand'" hover:text-gray-500 cursor-pointer @click="toggleExpand" />
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
/* breadcrumb transition */
.breadcrumb-move,
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
