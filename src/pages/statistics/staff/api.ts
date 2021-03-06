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

export async function getIndividualStatisticsList(params?: any) {
  return request<Individual[]>('/balanceFlow/individualStatisticsList', {
    params: { status: 1, ...params, departmentId: params.departmentId },
  })
}

export async function downloadExcel(params?: any) {
  return request('/balanceFlow/individualStatisticsDownloadList', {
    params: { status: 1, ...params, departmentId: params.departmentId },
    responseType: 'blob',
  })
}
