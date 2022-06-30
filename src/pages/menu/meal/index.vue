<script setup lang="tsx" name="meal">
import { AgGridVue } from 'ag-grid-vue3'
import { dayjs } from 'element-plus'
import { getFoodList } from '../food/api'
import { mealTypeList } from '../plan/api'
import { type Meal, getMealList } from './api'
import { useAgGrid } from '~/composables'
import { getUserList } from '~/pages/system/user/api'

const { agGridBind, agGridOn } = useAgGrid<Meal>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '姓名', field: 'userName', value: '', options: ({ value: username, ...params }) =>
      getUserList({ ...params, username }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.username, value: i.id })),
        total,
      })) },
    { headerName: '菜品', field: 'foodList', valueGetter: ({ data }) => data.foodList?.map(i => i.foodName).join('，'), value: '', options: ({ value: name, ...params }) =>
      getFoodList({ ...params, name }).then(({ data, total }) => ({
        data: data.map(i => ({ label: i.name, value: i.id })),
        total,
      })),
    },
    { headerName: '时间', field: 'beginTime,endTime', valueGetter: ({ data }) => data.foodDate, value: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'd').format('YYYY-MM-DD')].join(','), form: { type: 'date', props: { type: 'daterange' } } },
    { headerName: '类型', field: 'mealType', form: { type: 'radio' }, suppressSizeToFit: true, valueGetter: ({ data }) => mealTypeList.find(i => i.value === data.mealType)?.label, value: '2', options: mealTypeList },
  ],
  getMealList,
)
</script>

<template>
  <div layout>
    <VHeader />

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination />
    </div>
  </div>
</template>

<route lang="yaml">
name: meal
meta:
  title: 预报餐管理
  order: 4
</route>
