<script setup lang="ts">
import { useTagsviewStore } from '~/stores/tagsview'
defineProps({
  suppressBack: { type: Boolean, default: false },
})

const tagsView = useTagsviewStore()
</script>

<template>
  <div flex flex-nowrap justify-between items-center shadow p-3 bg="white dark:zinc-900" z-1>
    <div flex items-center whitespace-nowrap font-medium cursor-pointer hover:text-primary @click="tagsView.push()">
      <div v-if="suppressBack" bg-primary rounded w-2 h-full mr-3 />
      <i v-else mr-3 hover:text-primary text-sm cursor-pointer fa6-solid:arrow-left dense round flat @click="tagsView.goBack()" />
      {{ $route.meta.title }}
      {{ $route.query?.titleLabel ? ` : ${$route.query?.titleLabel}` : '' }}
      <i ml-1 text-xs fa6-solid:rotate-right />
    </div>

    <slot />
  </div>
</template>
