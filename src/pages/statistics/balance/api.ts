import { request } from '~/composables/request'

export interface DepartmentRow {
  id: string
  depId: number
  description: string
  departmentName: string
  phone: string
  photoName: string
  status: 0 | 1
  type: 0 | 1
}

export async function getDepartmentList(params?: object) {
  let count = 34
  return {
    data: Array(50).fill().map((_) => {
      let money = count
      count += 2
      let time = parseInt(Math.random() * 10) || 1
      let date = time + 6
      if (date < 10)
        date = `0${date}`
      return { id: count, name: '蔡健怡', cardId: '89A30272', oldMoney: `${count}.00`, changeMoney: '2.00', money: `${money}.00`, type: '消费', time: `2021-0${time}-08 ${date}:13:00`, type1: '早餐', window: '经华一号机' }
    }),
    total: 50,
  }
  // return request<DepartmentRow[]>('/dep/getDepList', {
  //   params: { status: 1, ...params },
  // })
}

export function put(body: object) {
  return request('/dep/updateDep', {
    method: 'put',
    body,
  })
}

export function post(body: object) {
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
