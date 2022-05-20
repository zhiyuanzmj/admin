<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { Row } from './api'
import { put } from './api'

const props = defineProps<{
  show: boolean
  row: Row
}>()
const row = $ref(cloneDeep(props.row))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

async function submit() {
  await formRef?.validate()
  await put(row)
  ElMessage.success('操作成功')
  show = false
  getList()
}
</script>

<template>
  <el-dialog v-model="show" :title="`${row.id ? '修改' : '添加'}用户`">
    <el-form ref="formRef" :model="row" grid="~ cols-2 gap-5" @submit.prevent="submit">
      <el-form-item required label="账号">
        <el-input v-model="row.username" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="row.nickname" />
      </el-form-item>
      <el-form-item required label="密码">
        <el-input v-model="row.password" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="row.confirmPassword" />
      </el-form-item>
      <span mt-3 mb="-2" text-right col-span-2>
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" native-type="submit">确认提交</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>
