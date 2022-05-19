<script setup lang="tsx">
import { AgGridVue } from 'ag-grid-vue3'
import type { Row } from './api'
import { getUserList, put } from './api'
// import VForm from './VForm.vue'
// import VFilter from '~/components/AgFilter/index.vue'
// import Pagination from '~/components/Pagination.vue'
import { useAgGrid } from '~/composables'

// defineOptions({ name: 'User' })

let show = $ref(false)
let row = $ref<Row>()

const { list, agGridBind, agGridOn, getList } = useAgGrid<Row>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: true, valueGetter: '', unCheck: true, pinned: 'left', suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '账号', field: 'username', value: '' },
    { headerName: '姓名', field: 'realname', value: '' },
    // { headerName: '角色', valueGetter: ({ data }) => data.roles.map((i: any) => i.roleName).join('，'), field: 'roles' },
    { headerName: '性别', valueGetter: 'data.sex_dictText', field: 'sex' },
    { headerName: '生日', field: 'birthday' },
    { headerName: '电话号码', field: 'phone' },
    { headerName: '状态', field: 'status', value: '', formType: 'toggle', headerClass: 'center', cellClass: 'center', maxWidth: 80 },
    {
      headerName: '操作',
      field: 'actions',
      unCheck: true,
      minWidth: 70,
      maxWidth: 70,
      pinned: 'right',
      suppressMovable: true,
      lockPosition: true,
      cellRenderer: {
        setup(props) {
          const { params } = $(toRefs(props))
          return () =>
            <div className="cursor-pointer text-gray-500 text-lg flex items-center gap-2 h-8">
              <i className="fa6-solid:pen-to-square hover:bg-blue-500"/>
              <i className="fa6-solid:trash-can hover:bg-red-500"/>
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
  <div class="flex flex-col flex-nowrap">
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div mt-3 p-3 flex flex-1 flex-col gap-2 shadow b="~ gray-300 dark:gray-700 solid" rounded>
      <!-- <VFilter /> -->
      <ag-grid-vue :row-data="list" v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" text>
          删除
        </el-button>
      </Pagination>
    </div>

    <!-- <VForm v-if="show" v-model:show="show" :row="row" /> -->
  </div>
</template>

<route lang="yaml">
meta:
  permission: /get/user
  title: 用户管理
</route>
