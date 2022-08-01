<script setup lang="tsx" name="statistics-total">
import { AgGridVue } from 'ag-grid-vue3'
import type { ReceiptAndPayment } from './api'
import { downloadExcel, getReceiptAndPaymentStatisticsList } from './api'

function cellRendererSelector(params: any) {
  if (params.node.rowPinned) {
    return {
      component: {
        setup({ params }: any) {
          const map = {
            allReceipt: 'allReceiptTotalMoney',
            allPayment: 'allPaymentTotalMoney',
            receiptMoney: 'receiptTotalMoney',
            paymentMoney: 'paymentTotalMoney',
            refundMoney: 'refundTotalMoney',
          }
          return () => <div>当前页({params.value}) ，总计({params.data[map[params.colDef.field as keyof typeof map]]})</div>
        },
      },
    }
  }
}

const { agGridBind, agGridOn, params } = useAgGrid<ReceiptAndPayment>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '部门', field: 'departmentId', valueGetter: ({ data }) => data.departmentName, form: { type: 'selectTree' }, value: '' },
    { headerName: '时间', form: { type: 'date', props: { type: 'daterange' } }, field: 'beginTime,endTime', value: '', hide: true },
    { headerName: '充值金额(元)', field: 'receiptMoney', cellRendererSelector },
    { headerName: '消费金额(元)', field: 'paymentMoney', cellRendererSelector },
    { headerName: '退款金额(元)', field: 'refundMoney', cellRendererSelector },
    { headerName: '收入合计(元)', field: 'allReceipt', cellRendererSelector },
    { headerName: '支出合计(元)', field: 'allPayment', cellRendererSelector },
  ],
  async (params) => {
    const result = await getReceiptAndPaymentStatisticsList(params)
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
        receiptMoney: 0,
        paymentMoney: 0,
        refundMoney: 0,
        allReceipt: 0,
        allPayment: 0,
      }),
    ...message,
  }]
}

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
      <ag-grid-vue v-bind="agGridBind" :pinned-bottom-row-data="pinnedBottomRowData" v-on="agGridOn" />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 收付款统计
</route>
