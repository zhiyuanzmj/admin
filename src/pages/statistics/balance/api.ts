import { request } from '~/composables/request'

export interface BalanceFlow {
  id: string
  userId?: string
  money?: string
  moneyType?: number
  arefund?: number
  payType?: string
  channel?: any
  remarks?: any
  payTimeType?: any
  gmtCreate?: string
  createBy?: string
  balance?: any
  faceLogId?: any
  userName?: string
  departmentName?: string
  departmentId?: number
  phone?: string
  'startTime,endTime': string
}

export async function getBalanceFlowList(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/list', {
    params: { status: 1, ...params },
  }).then((i) => {
    i.data = i.data.map(i => ({ ...i, moneyType: i.arefund ? 3 : i.moneyType }))
    return i
  })
}

export async function downloadExcel(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/listDownload', {
    params: { status: 1, ...params },
    responseType: 'blob',
  })
}
