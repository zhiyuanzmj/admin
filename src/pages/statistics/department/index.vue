<script setup lang="tsx" name="statistics-department">
import { AgGridVue } from 'ag-grid-vue3'
import type { BalanceFlow } from './api'
import { downloadExcel, getDepartmentStatisticsList } from './api'

const { agGridBind, agGridOn, params } = useAgGrid<BalanceFlow>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '部门', valueGetter: ({ data }) => data.departmentName, field: 'departmentId', value: '', form: { type: 'selectTree' } },
    { headerName: '时间', field: 'beginTime,endTime', unCheck: true, hide: true, value: '', form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '早餐次数', field: 'breakfastSunNum' },
    { headerName: '早餐金额(元)', hide: true, field: 'breakfastSunTotal' },
    { headerName: '中餐次数', field: 'lunchSunNum' },
    { headerName: '中餐金额(元)', hide: true, field: 'lunchSunTotal' },
    { headerName: '晚餐次数', field: 'dinnerSunNum' },
    { headerName: '晚餐金额(元)', hide: true, field: 'dinnerSunTotal' },
    { headerName: '合计次数', field: 'sunNum' },
    { headerName: '合计金额(元)', hide: true, field: 'sunTotal' },
  ],
  async (params) => {
    const result = await getDepartmentStatisticsList(params)
    getPinnedBottomRowData(result.data)
    return result
  },
)

let pinnedBottomRowData = $ref<any>()
function getPinnedBottomRowData(list: any) {
  pinnedBottomRowData = [list.reduce(
    (a: any, b: any) =>
      (Object.keys(a).forEach(key => a[key] += b[key] || ''), a),
    {
      breakfastSunNum: 0,
      breakfastSunTotal: 0,
      lunchSunNum: 0,
      lunchSunTotal: 0,
      dinnerSunNum: 0,
      dinnerSunTotal: 0,
      sunNum: 0,
      sunTotal: 0,
    })]
}

async function exportExcel() {
  download(await downloadExcel(params.value), '部门统计.xlsx')
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" :pinned-bottom-row-data="pinnedBottomRowData" v-on="agGridOn" />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 部门统计
</route>
