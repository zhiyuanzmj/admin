<script setup lang="tsx" name="department">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { Department } from './api'
import { drop, getDepartment, getDepartmentList, put } from './api'
import VForm from './components/VForm.vue'
import DepartmentTree from './components/DepartmentTree.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<Department>()
let treeKey = $ref(0)
let departmentId = $(useRouteQuery<string>('departmentId'))
let department = $ref<Department>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Department>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'ID', field: 'id', maxWidth: 80 },
    { headerName: '名称', field: 'departmentName', value: '', cellRenderer: { setup: ({ params }) => () =>
      <span
        onClick={() => (departmentId = params.data[!params.rowIndex && departmentId ? 'parent' : 'id']!)}
        className={`flex-inline items-center cursor-pointer gap-1.5 hover:text-primary ${departmentId && params.rowIndex ? 'ml-11' : ''}`}
      >
        {!params.rowIndex && departmentId
          ? <i className={`text-gray-400 i-bx-bxs-down-arrow ${params.data?.hasChildren ? '' : 'hidden'}`} />
          : params.data.hasChildren ? <i className={`text-gray-400 i-bx-bxs-right-arrow ${departmentId ? '-ml-6' : ''}`} /> : null}
        <span>{params.data?.departmentName}</span>
      </span>,
    } },
    { headerName: '电话号码', field: 'phone', value: '' },
    { headerName: '描述', field: 'description', value: '' },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <ElSwitch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: !props.params.value ? 1 : 0 })
            ElMessage.success('操作成功')
            getList()
          } }
          active-value={1}
          inactive-value={0}
        />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props) {
      const { params } = $(toRefs(props))
      return () =>
        <div className="flex items-center justify-between">
          <button className="i-fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = params.data
          }}/>
          <button className="i-fa6-solid:trash-can btn" onClick={() => onDrop([params.data])}/>
        </div>
    } } },
  ],
  async (params) => {
    department = departmentId ? await getDepartment(departmentId).then(i => i.data) : { hasChildren: true }
    if (department?.hasChildren) {
      const { data, total } = await getDepartmentList({ ...params, parent: departmentId })
      return { data: departmentId ? [department, ...data] : data, total }
    }
    return { data: department ? [department] : [], total: 0 }
  },
)

async function onDrop(list: Department[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
  treeKey++
}

function addHandler() {
  show = true
  row = { status: 1, parent: departmentId }
}

watch(() => departmentId, () => {
  getList()
})
</script>

<template>
  <div layout>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div flex="~ 1" gap-3 m-3>
      <DepartmentTree v-if="department" :key="treeKey" v-model:departmentId="departmentId" :department="department" />

      <div main m-0>
        <VFilter />
        <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
        <Pagination>
          <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
            删除
          </el-button>
        </Pagination>
      </div>
    </div>

    <VForm v-if="show" v-model:show="show" v-model:treeKey="treeKey" :row="row" />
  </div>
</template>

<route lang="yaml">
name: department
meta:
  title: 部门管理
  order: 2
</route>
