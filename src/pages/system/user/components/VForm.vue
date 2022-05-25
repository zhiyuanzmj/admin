<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { Row } from '../api'
import { editPassword, post, put } from '../api'

const props = defineProps<{
  show: boolean
  row: Row
}>()
const row = $ref(cloneDeep({ ...props.row, password: '' }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

const validatePass = (_: any, value: any, callback: any) => {
  if (!value)
    callback(new Error('不能为空'))
  else if (value !== row.password)
    callback(new Error('两次密码不一致'))
  else
    callback()
}

async function submit() {
  await formRef?.validate()
  const loading = ElLoading.service({ fullscreen: true })
  try {
    if (row.id) {
      await editPassword({ newPwd: row.password, oldPwd: row.confirmPassword })
      await put(row)
    } else {
      await post(row)
    }

    ElMessage.success('操作成功')
    show = false
    getList()
  } finally {
    loading.close()
  }
}
</script>

<template>
  <el-dialog v-model="show" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}用户`">
    <el-form ref="formRef" label-width="auto" :model="row" grid="~ cols-2 gap-5" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }, { type: 'email', message: '无效的邮箱格式', trigger: 'blur' }]" prop="username" label="账号">
        <el-input v-model="row.username" />
      </el-form-item>
      <el-form-item label="用户名" prop="nickname">
        <el-input v-model="row.nickname" />
      </el-form-item>
      <el-form-item label="密码" :rules="[{ message: '不能为空', required: !row.id }, { min: 8, message: '密码长度不能低于8位', trigger: 'blur' }]" prop="password">
        <el-input v-model="row.password" type="password" show-password autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="确认密码" :rules="{ validator: validatePass, trigger: 'blur' }" :required="!row.id" prop="confirmPassword">
        <el-input v-model="row.confirmPassword" type="password" show-password />
      </el-form-item>
      <span mt-3 mb="-2" text-right col-span-2>
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" native-type="submit">确认提交</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>
