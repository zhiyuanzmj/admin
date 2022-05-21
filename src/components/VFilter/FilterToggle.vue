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
  <q-toggle
    v-model="column.value"
    checked-icon="check"
    true-value="1"
    false-value="0"
    toggle-indeterminate
    class="!w-auto"
    @update:modelValue="getList"
  />
</template>
