<script setup lang="ts">
import Palette from './Palette.vue'
import HeaderSearch from './HeaderSearch/index.vue'
import { useUserStore } from '~/stores/user'
import UserForm from '~/pages/system/user/components/VForm.vue'

const props = defineProps<{
  isCollapse: boolean
}>()
const isCollapse = useVModel(props, 'isCollapse')
watch(useBreakpoints({ tablet: 768 }).smaller('tablet'), (val) => {
  isCollapse.value = val
})

let expand = $ref(false)
function toggleExpand() {
  expand = !expand
  expand
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen()
}

const show = ref(false)
const user = useUserStore()
const row = ref({ ...user.userInfo })
</script>

<template>
  <nav flex gap-3 items-center text-sm px-3>
    <i cursor-pointer :class="isCollapse ? 'i-line-md:menu-fold-right' : 'i-line-md:menu-fold-left'" @click="isCollapse = !isCollapse" />

    <el-breadcrumb mr-auto relative>
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <transition-group v-if="$route.path !== '/'" name="breadcrumb" appear>
        <el-breadcrumb-item v-for="(i) in $route.matched" :key="i.path" :to="i">
          {{ i.meta?.title }}
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>

    <HeaderSearch />
    <Palette />
    <button btn text-sm :class="expand ? 'i-fa6-solid:compress' : 'i-fa6-solid:expand'" @click="toggleExpand" />
    <el-dropdown>
      <div flex items-center gap-1 cursor-pointer>
        <i i-fa6-solid:circle-user text-xl text-gray-300 mx-1 />
        {{ user.userInfo.nickname }}
        <i i-fa-solid:sort-down self-start />
      </div>
      <template #dropdown>
        <el-dropdown-item mt="!1.5" @click="$router.push('/')">
          控制台
        </el-dropdown-item>
        <el-dropdown-item @click="show = true">
          个人设置
        </el-dropdown-item>
        <el-dropdown-item divided mb="!1.5" @click="user.logout()">
          退出登陆
        </el-dropdown-item>
      </template>
    </el-dropdown>
    <UserForm v-if="show" v-model:show="show" :row="row" />
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
