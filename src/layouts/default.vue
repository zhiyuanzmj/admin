<script setup lang="ts">
import Sidebar from './Sidebar/index.vue'
import Tagsview from './Tagsview/index.vue'
import Navigation from './Navigation/index.vue'
import { useTagsviewStore } from '~/stores/tagsview'

const tagsViewStore = useTagsviewStore()
</script>

<template>
  <div text="gray-700 dark:gray-200" grid="~ cols-[12.5rem_auto] rows-1" h-screen>
    <aside row-span-2 flex="~ col" shadow-md>
      <header h-12 flex gap-2 items-center px-3>
        <img src="/logo.png" w-8>
        <div>食堂管理系统</div>
      </header>
      <Sidebar row-span-2 flex-1 />
    </aside>

    <main grid="~ rows-[3rem_34px_auto]" overflow-x-hidden>
      <Navigation />
      <Tagsview overflow-auto z-10 />
      <div relative>
        <router-view v-slot="{ Component, route }">
          <transition
            :leave-active-class="`animated ${route.meta.transitionLeave} left-0 right-0 absolute animate-duration-500`"
            :enter-active-class="`animated ${route.meta.transitionEnter} left-0 right-0 absolute animate-duration-500`"
          >
            <keep-alive :key="tagsViewStore.viewKey" :include="tagsViewStore.cachedViews" :max="20">
              <component :is="Component" :key="$route.path" p-3 h-full />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>
