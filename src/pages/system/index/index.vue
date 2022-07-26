<script setup lang="tsx" name="system-index">
import { AgGridVue } from 'ag-grid-vue3'
import type { System } from './api'
import { getSystemList } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<System>()
const { agGridBind, agGridOn } = useAgGrid<System>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'parName', value: '' },
    { headerName: '默认值', field: 'parValue' },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props) {
      const { params } = $(toRefs(props))
      return () =>
        <div className="flex items-center justify-between">
          <button className="i-fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = params.data
          }}/>
        </div>
    } } },
  ],
  getSystemList,
)
</script>

<template>
  <div layout>
    <VHeader />

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  title: 系统设置
  order: 0
</route>
