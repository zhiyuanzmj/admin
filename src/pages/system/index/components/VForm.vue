<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { System } from '../api'
import { put } from '../api'

const props = defineProps<{
  show: boolean
  row: System
}>()
const row = $ref(cloneDeep({ ...props.row }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

async function submit() {
  await formRef?.validate()
  const loading = ElLoading.service({ fullscreen: true })
  try {
    await put(row)
    ElMessage.success('操作成功')
    show = false
    getList()
  } finally {
    loading.close()
  }
}
</script>

<template>
  <el-dialog v-model="show" :close-on-click-modal="false" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}角色`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="parName" label="名称">
        <el-input v-model="row.parName" />
      </el-form-item>
      <el-form-item label="默认值" prop="parValue">
        <el-input v-model="row.parValue" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
