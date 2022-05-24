<script setup lang="ts">
import Sidebar from './Sidebar/index.vue'
import Tagsview from './Tagsview/index.vue'
import Navigation from './Navigation/index.vue'
import { useTagsviewStore } from '~/stores/tagsview'

const tagsViewStore = useTagsviewStore()
</script>

<template>
  <div text="gray-700 dark:gray-200" grid="~ cols-[12.5rem_auto] rows-1" h-screen>
    <aside row-span-2 flex="~ col" b="0 r-1 r-zinc-200 dark:r-zinc-700" shadow-md z-3>
      <header h-12 flex gap-2 items-center px-3>
        <img src="/logo.png" w-8>
        <div>食堂管理系统</div>
      </header>
      <Sidebar row-span-2 flex-1 />
    </aside>

    <main grid="~ rows-[3rem_34px_auto]" overflow-x-hidden>
      <Navigation />
      <Tagsview />
      <router-view v-slot="{ Component, route }">
        <transition mode="out-in" name="main" appear>
          <keep-alive :key="tagsViewStore.viewKey" :include="tagsViewStore.cachedViews" :max="20">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.main-enter-active {
  transition: 0.2s;
}

.main-leave-active {
  transition: 0.15s;
}

.main-enter-from {
  margin-left: -20px;
  opacity: 0;
}

.main-leave-to {
  margin-left: 20px;
  opacity: 0;
}
</style>
