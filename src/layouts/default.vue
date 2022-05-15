<script setup lang="ts">
import Sidebar from './Sidebar/index.vue'
import Tagsview from './Tagsview/index.vue'
import Navigation from './Navigation/index.vue'
import { useTagsviewStore } from '~/stores/tagsview'

const tagsViewStore = useTagsviewStore()
</script>

<template>
  <div text-gray-700 dark:text-gray-200 grid="~ cols-[12.5rem_auto] rows-1" h-screen>
    <aside row-span-2 flex="~ col" shadow-md>
      <header h-12 flex gap-2 items-center px-3>
        <img src="/logo.png" w-8>
        <div>食堂管理系统</div>
      </header>
      <Sidebar row-span-2 flex-1 />
    </aside>

    <main grid="~ rows-[3rem_34px_auto]">
      <Navigation />
      <Tagsview overflow-auto z-10 />
      <div class="relative overflow-x-hidden p-3">
        <router-view v-slot="{ Component, route }">
          <transition
            :enter-active-class="`animated ${route.meta.transitionEnter} absolute h-[calc(100%-24px)] left-3 right-3`"
            :leave-active-class="`animated ${route.meta.transitionLeave} absolute h-[calc(100%-24px)] left-3 right-3`"
          >
            <keep-alive :key="tagsViewStore.viewKey" :include="tagsViewStore.cachedViews" :max="20">
              <component :is="Component" :key="$route.path" class="h-full animate-duration-500" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>
