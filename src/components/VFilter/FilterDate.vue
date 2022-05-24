<script lang="ts" setup>
import type { Column } from '~/composables'
defineProps<{
  index: number
  column: Column
}>()

const show = $ref(false)

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
  <q-input v-model="column.value" @click="show = true">
    <template #append>
      <q-icon name="event">
        <q-popup-proxy v-model="show" transition-show="scale" transition-hide="scale">
          <q-date v-model="column.value" mask="YYYY-MM-DD" @update:modelValue="getList" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
