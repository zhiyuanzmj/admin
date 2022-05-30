import { request } from '~/composables/request'

export interface Device {
  id?: string
  address?: string
  addressIp?: string
  loginName?: string
  loginPaw?: string
  name?: string
  port?: number
  status?: 0 | 1
  // 'type': 0
}

export function fetchFoodList(params: object) {
  return request<Device[]>('/device/getPersonList', {
    params,
  })
}

export function put(body: Device) {
  return request('/device/updatePerson', {
    method: 'put',
    body,
  })
}

export function post(body: Device) {
  return request('/device/insertPerson', {
    method: 'post',
    body,
  })
}

export function drop(id: Device['id']) {
  return request('/device/deletePerson', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
