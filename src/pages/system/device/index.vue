<script setup lang="tsx" name="device">
import { AgGridVue } from 'ag-grid-vue3'
import { ElMessage, ElMessageBox } from 'element-plus'
import { type Device, drop, getDeviceList, put } from './api'
import VForm from './components/VForm.vue'
import { useAgGrid } from '~/composables'

let show = $ref(false)
let row = $ref<Device>()

const { agGridBind, agGridOn, selectedList, getList } = useAgGrid<Device>(
  () => [
    { field: 'select', minWidth: 40, maxWidth: 40, lockPosition: 'left', pinned: 'left', valueGetter: '', unCheck: true, suppressMovable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'name', value: '' },
    { headerName: '窗口', field: 'channel', value: '' },
    { headerName: '位置', field: 'address', value: '' },
    { headerName: 'IP地址', field: 'addressIp', value: '' },
    { headerName: '端口', field: 'port', value: '' },
    { headerName: '登陆名', field: 'loginName', value: '' },
    { headerName: '密码', field: 'loginPaw' },
    { headerName: '状态', field: 'status', value: '1', form: { type: 'switch' }, cellRenderer: { setup: props => () =>
        <el-switch
          model-value={props.params.value}
          onClick={async () => {
            await ElMessageBox.confirm('确定修改状态?', '提示')
            await put({ ...props.params.data, status: !props.params.value ? 1 : 0 })
            ElMessage.success('操作成功')
            getList()
          } }
          active-value={1}
          inactive-value={0}
        />,
    } },
    { headerName: '操作', field: 'actions', unCheck: true, minWidth: 70, maxWidth: 70, suppressMovable: true, lockPosition: 'right', pinned: 'right', cellRenderer: { setup(props) {
      return () =>
        <div className="flex items-center justify-between">
          <button className="i-fa6-solid:pen-to-square btn" onClick={() => {
            show = true
            row = props.params.data
          }}/>
          <button className="i-fa6-solid:trash-can btn" onClick={() => onDrop([props.params.data])}/>
        </div>
    } } },
  ],
  getDeviceList,
)

async function onDrop(list: Device[]) {
  await ElMessageBox.confirm(`确定删除 ${list.length} 条数据`, '提示')
  const [fulfilled, rejected] = await (await Promise.allSettled(list.map(i => drop(i.id))))
    .reduce((a, b) => (a[b.status === 'fulfilled' ? 0 : 1]++, a), [0, 0])
  fulfilled && ElMessage.success(`删除成功 ${fulfilled} 条`); await nextTick()
  rejected && ElMessage.error(`删除失败 ${rejected} 条`)
  getList()
}

function addHandler() {
  show = true
  row = { status: 1 }
}
</script>

<template>
  <div layout>
    <VHeader>
      <el-button class="!ml-auto" type="primary" @click="addHandler">
        <div i-fluent:add-12-filled mr-1 />新增
      </el-button>
    </VHeader>

    <div main>
      <VFilter />
      <ag-grid-vue v-bind="agGridBind" v-on="agGridOn" />
      <Pagination>
        <el-button type="primary" :disabled="!selectedList.length" text @click="onDrop(selectedList)">
          删除
        </el-button>
      </Pagination>
    </div>

    <VForm v-if="show" v-model:show="show" :row="row" />
  </div>
</template>

<route lang="yaml">
name: device
meta:
  title: 设备管理
  order: 3
</route>
