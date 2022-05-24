<script lang="ts" setup>
import { isFunction } from 'lodash'
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
  const { data, total } = await props.column.options({ pageIndex: page, pageSize: 50, status: 1, value })
  lastPage = Math.ceil(total / 50)
  return data.map((i: any) => ({ label: i.label, value: `${i.value}` }))
}

const onFilter = async (value = '', update: Function = () => {}) => {
  if (!isFunction(props.column.options))
    return update()
  if (loading)
    return update()
  page = 1
  options = await getList(inputValue = value)
  update()
}
async function onScroll({ to, ref }: any) {
  if (
    !loading && page + 1 <= lastPage && to === options?.length - 1
  ) {
    loading = true
    page++
    const data = await getList(inputValue)
    options.push(...data)
    ref.refresh()
    setTimeout(() => loading = false)
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
</script>

<template>
  <el-select
    v-model="model"
    :loading="loading"
    :hide-selected="!column.formProps?.multiple"
    fill-input
    use-input
    emit-value
    map-options
    clearable
    v-bind="column.formProps"
    @virtual-scroll="onScroll"
    @filter="onFilter"
    @clear="getListInject()"
    @update:model-value="getListInject()"
  >
    <el-option v-for="i in list" :key="i.label" v-bind="i" />
  </el-select>
</template>
