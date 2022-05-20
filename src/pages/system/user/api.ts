import { request } from '~/composables/request'

export interface Row {
  id?: string
  username?: string
  nickname?: string
  password?: string
  confirmPassword?: string
}

export function getUserList() {
  return request<Row[]>('/getUsers', {
    method: 'post',
    body: { pageIndex: 1, pageSize: 10 },
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
