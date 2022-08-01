<script setup lang="tsx" name="statistics-department">
import { AgGridVue } from 'ag-grid-vue3'
import type { BalanceFlow } from './api'
import { downloadExcel, getDepartmentStatisticsList } from './api'

function cellRendererSelector(params: any) {
  if (params.node.rowPinned) {
    return {
      component: {
        setup({ params }: any) {
          const map = {
            breakfastSunNum: 'breakfastNum',
            lunchSunNum: 'lunchNum',
            dinnerSunNum: 'dinnerNum',
            sunNum: 'sunNum',
          }
          return () => <div>当前页({params.value}) ，总计({params.data[map[params.colDef.field as keyof typeof map]]})</div>
        },
      },
    }
  }
}

const { agGridBind, agGridOn, params } = useAgGrid<BalanceFlow>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '部门', valueGetter: ({ data }) => data.departmentName, field: 'departmentId', value: '', form: { type: 'selectTree' } },
    { headerName: '时间', field: 'beginTime,endTime', unCheck: true, hide: true, value: '', form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '早餐次数', field: 'breakfastSunNum', cellRendererSelector },
    { headerName: '早餐金额(元)', hide: true, field: 'breakfastSunTotal' },
    { headerName: '中餐次数', field: 'lunchSunNum', cellRendererSelector },
    { headerName: '中餐金额(元)', hide: true, field: 'lunchSunTotal' },
    { headerName: '晚餐次数', field: 'dinnerSunNum', cellRendererSelector },
    { headerName: '晚餐金额(元)', hide: true, field: 'dinnerSunTotal' },
    { headerName: '合计次数', field: 'sunNum', cellRendererSelector },
    { headerName: '合计金额(元)', hide: true, field: 'sunTotal' },
  ],
  async (params) => {
    const result = await getDepartmentStatisticsList(params)
    getPinnedBottomRowData(result)
    return result
  },
)

let pinnedBottomRowData = $ref<any>()
function getPinnedBottomRowData({ data, message }: any) {
  pinnedBottomRowData = [{
    ...data.reduce(
      (a: any, b: any) =>
        (Object.keys(a).forEach(key => a[key] += b[key] || 0), a),
      {
        breakfastSunNum: 0,
        breakfastSunTotal: 0,
        lunchSunNum: 0,
        lunchSunTotal: 0,
        dinnerSunNum: 0,
        dinnerSunTotal: 0,
        sunNum: 0,
        sunTotal: 0,
      }),
    ...message,
    sunNum: Object.values(message).reduce((a: any, b: any) => a + b, 0),
  }]
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
