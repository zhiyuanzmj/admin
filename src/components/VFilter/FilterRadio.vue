<script lang="ts" setup>
import type { Column } from '~/composables'
const props = defineProps<{
  column: Column
}>()

const getList = inject('getList', () => {})

let options = $ref<any>([])
if (typeof props.column.options === 'function') {
  props.column.options({ pageIndex: 1, pageSize: 99999, status: 1 }).then((i) => {
    options = i.data
  })
}
else {
  options = props.column.options
}
</script>

<template>
  <q-option-group
    v-model="column.value"
    class="flex whitespace-nowrap items-center !w-auto"
    :options="options"
    @update:model-value="getList"
  />
</template>
