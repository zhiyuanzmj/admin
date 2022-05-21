<script setup lang="tsx">
import { AgGridVue } from 'ag-grid-vue3'
import type { Row } from './api'
import { getUserList } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

defineOptions({ name: 'system-user' })

let show = $ref(false)
let row = $ref<Row>()

const { agGridBind, agGridOn } = useAgGrid<Row>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: true, valueGetter: '', unCheck: true, pinned: 'left', suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '账号', field: 'username', value: '' },
    { headerName: '姓名', field: 'nickname', value: '' },
    {
      headerName: '操作',
      field: 'actions',
      unCheck: true,
      minWidth: 80,
      maxWidth: 80,
      pinned: 'right',
      suppressMovable: true,
      lockPosition: true,
      cellRenderer: {
        setup(props) {
          const { params } = $(toRefs(props))
          return () =>
            <div className="flex items-center">
              <i className="fa6-solid:pen-to-square btn" onClick={() => {
                show = true
                row = params.data
              }}/>
              <i className="fa6-solid:trash-can btn"/>
            </div>
        },
      },
    },
  ],
  getUserList,
)

function addHandler() {
  show = true
  row = { status: 1, sex: 1 } as Row
}
</script>

<template>
  <div flex="~ col nowrap" gap-3>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <VFilter />
    <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
    <Pagination>
      <el-button type="primary" text>
        删除
      </el-button>
    </Pagination>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
meta:
  permission: /get/user
  title: 用户管理
</route>
