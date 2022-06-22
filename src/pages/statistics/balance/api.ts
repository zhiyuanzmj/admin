import { request } from '~/composables/request'

export interface BalanceFlow {
  id: string
  userId?: string
  money?: string
  moneyType: number
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
}

export async function getBalanceFlowList(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/list', {
    params: { status: 1, ...params },
  })
}
