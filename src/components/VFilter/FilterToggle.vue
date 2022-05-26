<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Column } from '~/composables'
defineProps({
  column: {
    type: Object as PropType<Column>,
    default: () => ({}),
  },
})

const getList = inject('getList', () => {})
</script>

<template>
  <el-switch
    v-model="column.value"
    active-value="1"
    :inactive-value="undefined"
    class="!w-auto"
    @update:model-value="getList"
  />
</template>
