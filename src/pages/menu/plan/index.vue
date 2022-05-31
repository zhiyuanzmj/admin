<script setup lang="tsx" name="plan">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { getFoodList } from '../food/api'
import type { Plan } from './api'
import { drop, getPlanList } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<Plan>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Plan>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '时间', field: 'date', value: '' },
    { headerName: '菜品', valueGetter: ({ data }) => data.foodInfo.map(i => i.name), field: 'foodInfo', value: '', options: ({ value: name, ...params }) =>
      getFoodList({ ...params, name }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.name, value: i.id })),
        total,
      })),
    },
    { headerName: '类型', field: 'mealType', value: '', options: [{ label: '早餐', value: '1' }, { label: '午餐', value: '2' }, { label: '晚餐', value: '3' }] },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', cellRenderer: { setup(props) {
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
  getPlanList,
)

async function onDrop(list: Plan[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { status: 1, mealType: 2, date: dayjs().format('YYYY-MM-DD') } as Plan
}
</script>

<template>
  <div flex="~ col nowrap" bg="zinc-100 dark:zinc-800">
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div m-3 p-3 pb-2 bg="white dark:zinc-900" shadow rounded flex="~ 1 col" gap-2>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
name: plan
meta:
  title: 每日菜单
  order: 3
</route>
