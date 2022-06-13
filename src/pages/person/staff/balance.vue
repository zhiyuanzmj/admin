<script setup lang="ts" name="balance">
import { ElMessage } from 'element-plus'
import type { DepartmentRow } from '../department/api'
import { getDepartmentList } from '../department/api'
import type { Row } from './api'
import { changeBalance, getStaffList } from './api'

const { id } = defineProps<{ id: string }>()

let row = $ref<Row>({})
let payType = $ref('微信')
const { data, close, status } = useWebSocket<any>(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}${baseURL}/webSocketServer/pay/1`)
watch(data, (val) => {
  val = JSON.parse(val)
  if (val.code === 200)
    row = val.data
})
onUnmounted(() => {
  close()
})

let departmentList = $ref<DepartmentRow[]>()
async function fetchDepartmentList() {
  ({ data: departmentList } = await getDepartmentList({ pageIndex: 1, pageSize: 1000 }))
}
fetchDepartmentList()

let staffList = $ref<Row[]>()
async function fetchStaffList(name = '') {
  ({ data: staffList } = await getStaffList({ name, pageIndex: 1, pageSize: 1000 }))
}
fetchStaffList()
let money = $ref<number | undefined>()
const moneyType = $ref<number>(1)
async function submit() {
  await changeBalance({ userId: row.id, money, payType, moneyType })
  fetchStaff()
  ElMessage.success({ message: '修改成功' })
}

async function fetchStaff(id = row.id) {
  money = undefined
  const { data } = await getStaffList({ pageIndex: 1, pageSize: 50, id, name: row.name, phone: row.phone })
  row = data[0]
}

if (id)
  fetchStaff(id)
</script>

<template>
  <div layout>
    <VHeader>
      <el-alert effect="dark" show-icon :closable="false" class="!w-auto" :title="`人脸设备连接${status === 'OPEN' ? '成功' : '失败'}`" :type="status === 'OPEN' ? 'success' : 'error'" />
    </VHeader>
    <div main p-10>
      <el-form w="1/2" label-width="80px" @submit.prevent="fetchStaff()">
        <el-form-item label="照片">
          <div w-48 h-48 b="~ dashed gray-200">
            <el-image class="h-full w-full" :src="`/api/file${row.photoName}`">
              <template #error>
                <div w-48 h-48 flex justify-center items-center>
                  <i ep:picture text="gray-400 4xl" />
                </div>
              </template>
            </el-image>
          </div>
        </el-form-item>
        <el-form-item label="部门" prop="department.id">
          <el-select v-model="row.department" value-key="id">
            <el-option v-for="i in departmentList" :key="i.id" :label="i.departmentName" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-select v-model="row.name" w-full filterable remote :remote-method="fetchStaffList" value-key="id" @change="fetchStaff()">
            <el-option v-for="i in staffList" :key="i.id" :label="i.name" :value="i.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <div flex gap-5>
            <el-input v-model="row.phone">
              <template #append>
                <el-button bg-primary native-type="submit"><i fa6-solid:magnifying-glass text-xs mr-1 />查询</el-button>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item />
      </el-form>
      <el-form w="1/2" label-width="80px" @submit.prevent="submit">
        <el-form-item label="充值类型" label-position="left">
          <el-select v-model="row.payType" w-25 mr-3>
            <el-option v-for="i in ['微信', '支付宝', '现金']" :key="i" :label="i" :value="i" />
          </el-select>
          <el-radio-group v-model="moneyType">
            <el-radio :label="1">充值</el-radio>
            <el-radio :label="2">退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-position="top" :label="`${moneyType === 1 ? '充值' : '退款'}金额`">
          <el-input v-model="money" :disabled="!row.id" type="number" />
          <div text-gray-500>{{ `账户余额：${row.money || 0}元` }}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!row.id" native-type="submit" bg-primary>确认提交</el-button>
          <el-button @click="row = {}; money = undefined;moneyType = 1">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<route lang="yaml">
path: balance/:id?
name: balance
meta:
  title: 余额充值
  layout: default
  hidden: true
</route>
