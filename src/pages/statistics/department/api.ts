import { request } from '~/composables/request'

export interface BalanceFlow {
  id: string
  breakfastSunNum: number
  breakfastSunTotal: number
  lunchSunNum: number
  lunchSunTotal: number
  dinnerSunNum: number
  dinnerSunTotal: number
  sunNum: number
  sunTotal: number
  userName?: string
  departmentName?: string
  departmentId?: number
  phone?: string
}

export async function getDepartmentStatisticsList(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/departmentStatistics', {
    params: { status: 1, ...params },
  })
}

export async function downloadExcel(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/departmentStatisticsDownload', {
    params: { status: 1, ...params },
    responseType: 'blob',
  })
}
