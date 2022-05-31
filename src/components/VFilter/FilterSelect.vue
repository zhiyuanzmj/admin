<script lang="ts" setup>
import { isFunction } from 'lodash-es'
import type { PropType } from 'vue'
import type { Column } from '~/composables'
const props = defineProps({
  column: {
    type: Object as PropType<Column>,
    default: () => ({}),
  },
})

let page = $ref(1)
let lastPage = $ref(0)
let loading = $ref(false)
let inputValue = $ref('')
let options = $ref(isFunction(props.column.options) ? [] : props.column.options)
const list = $computed(() => options.map(i => ({ ...i, value: `${i.value}` })))

async function getList(value: string) {
  if (!isFunction(props.column.options))
    return []
  loading = true
  const { data, total } = await props.column.options({ pageIndex: page, pageSize: 50, status: 1, value }).finally(() => loading = false)
  lastPage = Math.ceil(total / 50)
  return data.map((i: any) => ({ label: i.label, value: `${i.value}` }))
}

const onFilter = async (value = '') => {
  if (!isFunction(props.column.options))
    return
  if (loading)
    return
  page = 1
  options = await getList(inputValue = value)
}
async function onScroll() {
  if (
    !loading && page + 1 <= lastPage
  ) {
    page++
    const data = await getList(inputValue)
    options.push(...data)
  }
}

setTimeout(() =>
  props.column.value && onFilter(),
)

const getListInject = inject('getList', () => {})

const model = $computed<any>({
  get: () => props.column.formProps?.multiple ? (props.column.value ? props.column.value?.split(',') : []) : props.column.value,
  set: val => props.column.value = props.column.formProps?.multiple ? (val?.join(',') || '') : val,
})

const bottomRef = ref()
useIntersectionObserver(bottomRef, ([{ isIntersecting }]) => {
  if (isIntersecting)
    onScroll()
})
</script>

<template>
  <el-select
    v-model="model"
    :loading="loading"
    clearable
    filterable
    v-bind="column.formProps"
    :remote-method="onFilter"
    @visible-change="(val:any) => val && onFilter()"
    @clear="getListInject()"
    @update:model-value="getListInject()"
  >
    <el-option v-for="i in list" :key="i.value" v-bind="i" />
    <div ref="bottomRef" />
  </el-select>
</template>
