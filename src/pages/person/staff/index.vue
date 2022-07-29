<script setup lang="tsx" name="staff">
import { AgGridVue } from 'ag-grid-vue3'
import { ElImage, ElLoading, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import type { Department } from '../department/api'
import { getDepartment } from '../department/api'
import type { Row } from './api'
import { downloadExcel, drop, getStaffList, importExcel, put } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'
import DepartmentTree from '~/pages/person/department/components/DepartmentTree.vue'

let show = $ref(false)
let departmentId = $(useRouteQuery<string>('departmentId'))
let department = $ref<Department>({})
watch(() => departmentId, async () => {
  ({ data: department } = await getDepartment(departmentId))
}, { immediate: true })

const previewSrcList = $computed(() => (list: Row[] = []) => list.map(i => `/api/file${i.photoName}`))
let { agGridBind, agGridOn, selectedList, getList, list, row } = $(useAgGrid<Row>(
  getColumnDefs,
  params => getStaffList({ ...params, department: departmentId }),
))
function getColumnDefs() {
  return [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '姓名', field: 'name', value: '' },
    { headerName: '部门', valueGetter: 'data.department.departmentName', field: 'department' },
    { headerName: '照片', field: 'photoName', cellRenderer: { setup(props: any) {
      const src = `/api/file${props.params.value}`
      return () => <ElImage v-show={props.params.value} initial-index={props.params.rowIndex} previewTeleported preview-src-list={previewSrcList(list)} src={src} class="h-10 mt-4 cursor-pointer"/>
    } } },
    { headerName: '性别', field: 'sex', valueGetter: ({ data }: any) => data.sex ? '男' : '女' },
    { headerName: '手机号', field: 'phone', value: '' },
    { headerName: '职位', field: 'job' },
    { headerName: '职级', field: 'rank' },
    { headerName: '余额', field: 'money' },
    { headerName: '入职时间', field: 'entryDate' },
    { headerName: '退休时间', field: 'retirementDate' },
    { headerName: '住址', field: 'address' },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: (props: any) => () =>
        <ElSwitch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: !props.params.value })
            ElMessage.success('操作成功')
            getList()
          } }
        />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props: any) {
      return () =>
        <div className="flex items-center justify-between">
          <button className="i-fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = props.params.data
          }}/>
          <button className="i-fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>
    } } },
  ]
}

async function onDrop(list = [row]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { sex: 1, status: 1 }
}

let buttonKey = $ref(0)
let failList = $ref([])
let showFailList = $ref(false)
async function importExcelHandler({ raw }: any) {
  const { close } = ElLoading.service({ fullscreen: true, text: '正在导入请稍等...' })
  const { code, data } = await importExcel(raw)
  if (code === 200) {
    ElMessage.success('导入成功')
  } else {
    failList = data
    showFailList = true
    ElMessage.error('导入失败')
  }
  close()
  buttonKey++
}

async function downloadTemplate() {
  download(await downloadExcel(), '人员信息模版.xlsx')
}

const failColumnList = getColumnDefs().slice(1, -1)
</script>

<template>
  <div layout>
    <VHeader>
      <!-- <el-button ml-auto @click="$router.push({ name: 'balance', params: { id: row?.id } })">余额充值</el-button> -->
      <el-upload
        :key="buttonKey"
        class="mr-3"
        :on-change="importExcelHandler"
        :auto-upload="false"
        :show-file-list="false"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        :limit="1"
      >
        <el-button>导入Excel</el-button>
      </el-upload>
      <el-button @click="downloadTemplate">下载模版</el-button>

      <el-button type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div flex="~ 1" gap-3 m-3>
      <DepartmentTree v-if="department" v-model:departmentId="departmentId" :department="department" />

      <div main m-0>
        <VFilter />
        <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
        <Pagination>
          <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
            删除
          </el-button>
        </Pagination>
      </div>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
    <el-dialog v-model="showFailList" :title="`导入失败列表（${failList.length}条）`">
      <ag-grid-vue
        :class="`ag-theme-alpine${isDark.value ? '-dark' : ''}`"
        :column-defs="failColumnList"
        h="[calc(100vh-265px)]"
        :row-data="failList"
      />
    </el-dialog>
  </div>
</template>

<route lang="yaml">
name: staff
meta:
  order: 1
  title: 人员信息
</route>
