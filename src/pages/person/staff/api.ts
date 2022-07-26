import type { DepartmentRow } from '../department/api'
import { request } from '~/composables/request'

export interface Row {
  id?: string
  department?: DepartmentRow
  name?: string
  phone?: string
  photoName?: string
  birthday?: string
  job?: string
  rank?: string
  money?: string
  entryDate?: string
  retirementDate?: string
  address?: string
  sex?: 0 | 1
  status?: 0 | 1
  type?: 0 | 1
  payType?: string
}

export function getStaffList(params: object) {
  return request<Row[]>('/person/getPersonList', {
    params: { status: 1, ...params },
  })
}

export function put(body: object) {
  return request('/person/updatePerson', {
    method: 'put',
    body,
  })
}

export function post(body: object) {
  return request('/person/insertPerson', {
    method: 'post',
    body,
  })
}

export function drop(id: any) {
  return request('/person/deletePerson', {
    method: 'delete',
    params: { noMessage: true, id },
  })
}

export function changeBalance(body: object) {
  return request('/person/changeBalance', {
    method: 'put',
    body,
  })
}

export async function importExcel(file: any) {
  const body = new FormData()
  body.append('file', file)
  return fetch('/api/person/importExcel', {
    method: 'post',
    body,
    headers: getHeaders(),
  }).then(i => i.json())
}

export async function downloadExcel() {
  return request('/person/downloadImport', {
    responseType: 'blob',
  })
}
