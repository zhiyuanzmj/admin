import { request } from '~/composables/request'

export interface Row {
  id?: string
  username?: string
  nickname?: string
  password?: string
  state: 0 | 1
  confirmPassword?: string
}

export function getUserList(params: object) {
  return request<Row[]>('/getUsers', {
    params,
  })
}

export function put(body: object) {
  return request('/updateProfile', {
    method: 'put',
    body,
  })
}

export function post(body: object) {
  return request('/addUsers', {
    method: 'post',
    body,
  })
}

export function drop(id: any) {
  return request(`/users/del/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
