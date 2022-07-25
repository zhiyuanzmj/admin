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
  'beginTime,endTime'?: string
}

export async function getIndividualStatisticsList(params?: object) {
  return request<Individual[]>('/balanceFlow/individualStatisticsList', {
    params: { status: 1, ...params, departmentId: params.departmentId || 0 },
  })
}

export async function downloadExcel(params?: object) {
  return request<BalanceFlow[]>('/balanceFlow/individualStatisticsDownloadList', {
    params: { status: 1, ...params, departmentId: params.departmentId || 0 },
    responseType: 'blob',
  })
}
