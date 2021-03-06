import { request } from '~/composables/request'

export interface ReceiptAndPayment {
  id: string
  receiptMoney: number
  paymentMoney: number
  refundMoney: number
  allReceipt: number
  allPayment: number
  departmentName: string
  departmentId: string
  'beginTime,endTime': string
}

export async function getReceiptAndPaymentStatisticsList(params?: object) {
  return request<ReceiptAndPayment[]>('/balanceFlow/receiptAndPaymentStatistics', {
    params: { status: 1, ...params },
  })
}

export async function downloadExcel(params?: object) {
  return request('/balanceFlow/receiptAndPaymentStatisticsDownload', {
    params: { status: 1, ...params },
    responseType: 'blob',
  })
}
