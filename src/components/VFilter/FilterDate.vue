<script lang="ts" setup>
import type { Column } from '~/composables'
const { column } = defineProps<{
  index: number
  column: Column
}>()

const getList = inject('getList', () => {})
</script>

<template>
  <el-date-picker v-model="column.value" value-format="YYYY-MM-DD" @update:model-value="getList" />
</template>
