<script setup lang="ts">
import { useTagsviewStore } from '~/stores/tagsview'
defineProps({
  back: { type: Boolean, default: true },
})

const tagsView = useTagsviewStore()
</script>

<template>
  <!-- b="0 b white dark:zinc-700" -->
  <div flex items-center shadow p-3 bg="white dark:zinc-900" z-1>
    <div v-if="!back" bg-blue-400 rounded w-2 h-full mr-3 />
    <i v-else mr-3 hover:text-blue-500 text-sm cursor-pointer fa6-solid:arrow-left dense round flat @click="tagsView.goBack()" />
    <div flex items-center font-medium mr-auto cursor-pointer hover:text-blue-400 @click="tagsView.push()">
      {{ $route.meta.title }}
      {{ $route.query?.titleLabel ? ` : ${$route.query?.titleLabel}` : '' }}
      <i ml-1 text-xs fa6-solid:rotate-right />
    </div>
    <slot />
  </div>
</template>
