<script setup lang="tsx" name="statistics-total">
import { AgGridVue } from 'ag-grid-vue3'
import type { ReceiptAndPayment } from './api'
import { downloadExcel, getReceiptAndPaymentStatisticsList } from './api'

const { agGridBind, agGridOn, params } = useAgGrid<ReceiptAndPayment>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '时间', form: { type: 'date', width: '260px', props: { type: 'daterange' } }, field: 'startTime,endTime', value: '', hide: true },
    { headerName: '充值金额(元)', field: 'receiptMoney' },
    { headerName: '消费金额(元)', field: 'paymentMoney' },
    { headerName: '退款金额(元)', field: 'refundMoney' },
    { headerName: '收入合计(元)', field: 'allReceipt' },
    { headerName: '支出合计(元)', field: 'allPayment' },

  ],
  getReceiptAndPaymentStatisticsList,
)

async function exportExcel() {
  download(await downloadExcel(params.value), '收付款统计.xlsx')
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
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 收付款统计
  order: 2
</route>
