import { request } from '~/composables/request'

export interface Department {
  id?: string
  depId?: number
  description?: string
  departmentName?: string
  parent?: string
  parentIds?: string[]
  hasChildren?: boolean
  phone?: string
  photoName?: string
  status?: 0 | 1
  type?: 0 | 1
}

export function getDepartmentList(params: object) {
  return request<Department[]>('/dep/getDepList', {
    params: { status: 1, ...params },
  })
}

export function getDepartment(id: string) {
  return request<Department>('/dep/getDepById', {
    params: { id },
  })
}

export function put(body: Department) {
  return request('/dep/updateDep', {
    method: 'put',
    body,
  })
}

export function post(body: Department) {
  return request('/dep/insertDep', {
    method: 'post',
    body,
  })
}

export function drop(id: any) {
  return request('/dep/deleteDep', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}
