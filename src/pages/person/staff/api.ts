import { request } from '~/composables/request'

export function getUserList() {
  return request('/person/getPersonList', {
    params: {
      current: 1,
      size: 10,
    },
  })
}

