import { request } from '~/composables/request'

export interface System {
  id?: string
  parName?: string
  parValue?: string
}

export function getSystemList(params: object) {
  return request<System[]>('/parameter/list', {
    params,
  })
}

export function put(body: System) {
  return request('/parameter/update', {
    method: 'put',
    body,
  })
}
