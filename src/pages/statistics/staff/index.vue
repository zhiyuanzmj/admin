<script setup lang="tsx" name="statistics-staff">
import { AgGridVue } from 'ag-grid-vue3'
import { getStaffList } from '../../person/staff/api'
import type { Individual } from './api'
import { downloadExcel, getIndividualStatisticsList } from './api'

function cellRendererSelector(params: any) {
  if (params.node.rowPinned) {
    return {
      component: {
        setup({ params }: any) {
          const total = params.colDef.field === 'breakfastSunNum' ? 'breakfastNum' : params.colDef.field === 'lunchSunNum' ? 'lunchNum' : params.colDef.field === 'dinnerSunNum' ? 'dinnerNum' : 'total'
          return () => <div>当前页({params.value}) ，总计({params.data[total]})</div>
        },
      },
    }
  }
}

const { agGridBind, agGridOn, params, columnList } = useAgGrid<Individual>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '部门', field: 'departmentId', valueGetter: ({ data }) => data.departmentName, form: { type: 'selectTree' }, value: '' },
    { headerName: '姓名', valueGetter: ({ data }) => data.userName, field: 'userId', value: '', options: ({ value: name, ...params }) =>
      getStaffList({ ...params, name, department: columnList.find(i => i.field === 'departmentId')?.value }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.name, value: i.id })),
        total,
      })),
    },
    { headerName: '时间', field: 'beginTime,endTime', unCheck: true, hide: true, value: '', form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '手机', field: 'phone' },
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
    const result = await getIndividualStatisticsList(params)
    getPinnedBottomRowData(result)
    return result
  },
)
const departmentColumn = $computed(() => columnList.find(i => i.field === 'departmentId')!)
const userColumn = $computed(() => columnList.find(i => i.field === 'userId')!)
watch(() => departmentColumn.value, () => {
  userColumn.value = ''
}, { flush: 'sync' })

async function exportExcel() {
  download(await downloadExcel(params.value), '人员统计.xlsx')
}

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
    total: Object.values(message).reduce((a: number, b: number) => a + b, 0),
  }]
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue
        v-bind="agGridBind"
        :pinned-bottom-row-data="pinnedBottomRowData"
        v-on="agGridOn"
      />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 就餐统计
</route>
