<script setup lang="tsx" name="system-index">
import { AgGridVue } from 'ag-grid-vue3'
import { getDeviceList } from '../device/api'
import type { Log } from './api'
import { getLogList, logTypeList } from './api'
import { useAgGrid } from '~/composables'
import { getStaffList } from '~/pages/person/staff/api'

const { agGridBind, agGridOn } = useAgGrid<Log>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '设备名称', field: 'devId', valueGetter: ({ data }) => data.devName, value: '', options: params => getDeviceList(params).then(i => ({ ...i, data: i.data.map(item => ({ label: item.name, value: item.id })) })) },
    { headerName: '设备IP', field: 'devIp' },
    { headerName: '人脸信息', valueGetter: ({ data }) => data.personName, field: 'personId', value: '', options: params => getStaffList(params).then(i => ({ ...i, data: i.data.map(item => ({ label: item.name, value: item.id })) })) },
    { headerName: '类型', valueGetter: ({ data }) => logTypeList.find(i => i.value === data.type)?.label, field: 'type', value: '', options: logTypeList },
    { headerName: '时间', field: 'beginTime,endTime', valueGetter: ({ data }) => data.beginTime, value: '', form: { type: 'date', props: { type: 'daterange' } } },
  ],
  getLogList,
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
meta:
  title: 下发日志
  order: 4
</route>
