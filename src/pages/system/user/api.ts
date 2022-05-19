import { request } from '~/composables/request'

export interface Row {
  id: string
  username: string
  realname: string
  sex: 1 | 2
  status: 0 | 1
  birthday: string
  phone: string
  password: string
  selectedroles?: string
  staffId: string
  staffName: string
  roles: any[]
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
