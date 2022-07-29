<script setup lang="tsx" name="statistics-staff">
import { AgGridVue } from 'ag-grid-vue3'
import { getStaffList } from '../../person/staff/api'
import type { Individual } from './api'
import { downloadExcel, getIndividualStatisticsList } from './api'

const { agGridBind, agGridOn, params, columnList } = useAgGrid<Individual>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '部门', field: 'departmentId', valueGetter: ({ data }) => data.departmentName, form: { type: 'selectTree' }, value: '' },
    { headerName: '姓名', valueGetter: ({ data }) => data.userName, field: 'userId', value: '', options: ({ value: name, ...params }) =>
      getStaffList({ ...params, name, department: columnList.find(i => i.field === 'departmentId')?.value }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.name, value: i.id })),
        total,
      })),
    },
    { headerName: '时间', field: 'beginTime,endTime', unCheck: true, hide: true, value: '', form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '手机', field: 'phone' },
    { headerName: '早餐次数', field: 'breakfastSunNum' },
    { headerName: '早餐金额(元)', field: 'breakfastSunTotal' },
    { headerName: '中餐次数', field: 'lunchSunNum' },
    { headerName: '中餐金额(元)', field: 'lunchSunTotal' },
    { headerName: '晚餐次数', field: 'dinnerSunNum' },
    { headerName: '晚餐金额(元)', field: 'dinnerSunTotal' },
    { headerName: '合计次数', field: 'sunNum' },
    { headerName: '合计金额(元)', field: 'sunTotal' },
  ],
  async params => getIndividualStatisticsList(params),
)
const departmentColumn = $computed(() => columnList.find(i => i.field === 'departmentId')!)
const userColumn = $computed(() => columnList.find(i => i.field === 'userId')!)
watch(() => departmentColumn.value, () => {
  userColumn.value = ''
}, { flush: 'sync' })

async function exportExcel() {
  download(await downloadExcel(params.value), '人员统计.xlsx')
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 就餐统计
  order: 2
</route>
