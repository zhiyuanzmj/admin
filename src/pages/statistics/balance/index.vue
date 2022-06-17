<script setup lang="tsx" name="department">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { DepartmentRow } from './api'
import { drop, getDepartmentList, put } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<DepartmentRow>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<DepartmentRow>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '姓名', field: 'name', value: '' },
    { headerName: '原有金额', field: 'oldMoney' },
    { headerName: '变动金额', field: 'changeMoney' },
    { headerName: '实时金额', field: 'money' },
    { headerName: '类型', field: 'type', value: '' },
    { headerName: '变动时间', field: 'time' },
    { headerName: '窗口', field: 'window' },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props) {
      const { params } = $(toRefs(props))
      return () =>
        <div className="flex items-center justify-between">
          <button className="fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = params.data
          }}/>
          <button className="fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
        </div>
    } } },
  ],
  getDepartmentList,
)

async function onDrop(list: DepartmentRow[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { status: 1 } as DepartmentRow
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
name: department
meta:
  title: 余额流水
  order: 2
</route>
