import { request } from '~/composables/request'

export interface Individual {
  id?: string
  breakfastSunNum?: number
  breakfastSunTotal?: number
  lunchSunNum?: number
  lunchSunTotal?: number
  dinnerSunNum?: number
  dinnerSunTotal?: number
  sunNum?: number
  sunTotal?: number
  userId?: string
  userName?: string
  departmentName?: string
  departmentId?: number
  phone?: string
}

export async function getIndividualStatisticsList(params?: object) {
  return request<Individual[]>('/balanceFlow/individualStatistics', {
    params: { status: 1, ...params },
  })
}

export async function downloadExcel(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/individualStatisticsDownload', {
    params: { status: 1, ...params },
    responseType: 'blob',
  })
}
