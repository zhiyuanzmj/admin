<script setup lang="tsx" name="statistics-balance">
import { AgGridVue } from 'ag-grid-vue3'
import { ElLoading } from 'element-plus'
import type { BalanceFlow } from './api'
import { downloadExcel, getBalanceFlowList } from './api'
import { mealTypeList } from '~/pages/menu/plan/api'

const { agGridBind, agGridOn, params } = useAgGrid<BalanceFlow>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '部门', valueGetter: ({ data }) => data.departmentName, field: 'departmentId', value: '', form: { type: 'selectTree' } },
    { headerName: '姓名', field: 'userName', value: '' },
    { headerName: '手机', field: 'phone', value: '' },
    { headerName: '消费类型', field: 'payType', options: [{ label: '微信', value: '微信' }, { label: '支付宝', value: '支付宝' }, { label: '现金', value: '现金' }], value: '' },
    { headerName: '账户余额', field: 'balance' },
    { headerName: '变动类型', field: 'moneyType', valueGetter: ({ data }) => data.moneyType === 1 ? '收入' : '支出', options: [{ label: '收入', value: '1' }, { label: '支出', value: '2' }, { label: '退款', value: '3' }], value: '' },
    { headerName: '变动金额(元)', field: 'money' },
    { headerName: '类型', field: 'payTimeType', valueGetter: ({ data }) => mealTypeList.find(i => i.value === data.payTimeType)?.label, value: '', options: mealTypeList },
    { headerName: '变动时间', valueGetter: ({ data }) => data.gmtCreate, field: 'beginTime,endTime', value: '', form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '窗口', field: 'channel' },
  ],
  getBalanceFlowList,
  // params => getBalanceFlowList({ ...params, ...params.moneyType === '3' ? { arefund: 1, moneyType: undefined } : {} }),
)

async function exportExcel() {
  const loading = ElLoading.service()
  download(await downloadExcel(params.value))
  loading.close()
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
  title: 余额流水
</route>
