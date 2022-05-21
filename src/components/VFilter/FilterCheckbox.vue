<script lang="ts" setup>
import type { Column } from '~/composables'
defineProps<{
  index: number
  column: Column
}>()

const getList = inject('getList', () => {})
</script>

<template>
  <q-checkbox
    v-model="column.value"
    false-value=""
    true-value="1"
    class="!w-auto"
    @update:modelValue="getList"
  />
</template>

<style scoped>
  :deep(.q-checkbox__inner--indet) {
    @apply text-gray-400;
  }
</style>
