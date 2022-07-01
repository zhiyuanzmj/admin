import { request } from '~/composables/request'

export const logTypeList = [{ label: '下发成功', value: 1 }, { label: '下发失败', value: 0 }]

export interface Log {
  id?: string
  devName?: string
  devIp?: string
  devId?: string
  personName?: string
  personId?: string
  type?: typeof logTypeList[number]['value']
  gmtModified?: string
  'beginTime,endTime'?: string
}

export function getLogList(params: object) {
  return request<Log[]>('/deviceLog/list', {
    params,
  })
}

