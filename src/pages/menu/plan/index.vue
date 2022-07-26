<script setup lang="tsx" name="plan">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import type { Plan } from './api'
import { drop, getPlanList, mealTypeList } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'
const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

let show = $ref(false)
let row = $ref<Plan>()
const { agGridBind, agGridOn, selectedList, getList, columnList } = useAgGrid<Plan>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '时间', valueGetter: ({ data }) => `${data.date} (${weekList[dayjs(data.date).day()]})`, field: 'minDate,maxDate', value: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'd').format('YYYY-MM-DD')].join(','), form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '菜品', field: 'foodInfo', valueGetter: ({ data }) => data.foodInfo.map(i => i.name) },
    { headerName: '类型', field: 'mealType', form: { type: 'radio' }, valueGetter: ({ data }) => mealTypeList.find(i => i.value === data.mealType)?.label, value: '2', options: mealTypeList },
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
  row = {
    status: 1,
    mealType: Number(columnList.find(i => i.field === 'mealType')?.value),
    date: dayjs().format('YYYY-MM-DD'),
  } as Plan
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
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
name: plan
meta:
  title: 每日菜单
  order: 3
</route>
