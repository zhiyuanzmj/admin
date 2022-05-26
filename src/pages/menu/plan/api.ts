import type { FoodRow } from '../food/api'
import { request } from '~/composables/request'

export interface Plan {
  id: string
  date: string
  foodEnum: FoodRow[]
}

export function getDepartmentList(params: object) {
  return request<Plan[]>('/foodMenu/getMenu', {
    params,
  })
}

export function put(body: Plan) {
  return request('/foodMenu/updateMenu', {
    method: 'put',
    body,
  })
}

export function post(body: Plan) {
  return request('/foodMenu/addMenu', {
    method: 'post',
    body,
  })
}

export function drop(id: Plan['id']) {
  return request(`/foodMenu/deleteMenu/${id}`, {
    method: 'delete',
    params: { noMessage: true },
  })
}
