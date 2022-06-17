import type { mealTypeList } from '../plan/api'
import { request } from '~/composables/request'

export interface Meal {
  id?: string
  userName?: string
  foodList?: {
    foodName: string
  }[]
  foodDate?: string
  status?: 0 | 1
  mealType?: typeof mealTypeList[number]['value']
}

export function getMealList(params: object) {
  return request<Meal[]>('/foodMeal/getFoodMeal', {
    params: { status: 1, ...params },
  })
}
