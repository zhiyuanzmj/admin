<script setup lang="ts">
import type { FormInstance, UploadInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { type DepartmentRow, getDepartmentList } from '../../department/api'
import type { Row } from '../api'
import { post, put } from '../api'

const props = defineProps<{
  show: boolean
  row: Row
}>()
const row = $ref(cloneDeep({ ...props.row }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let departmentList = $ref<DepartmentRow[]>()
async function fetchDepartmentList() {
  ({ data: departmentList } = await getDepartmentList({ pageIndex: 1, pageSize: 1000 }))
}
fetchDepartmentList()

const uploadRef = shallowRef<UploadInstance>()
async function submit() {
  const loading = ElLoading.service({ fullscreen: true })
  try {
    row.id ? await put(row) : await post(row)
    ElMessage.success('操作成功')
    show = false
    getList()
  } finally {
    loading.close()
  }
}
function onSuccess({ data }: any = {}) {
  if (data)
    row.photoName = data
  submit()
}
</script>

<template>
  <el-dialog v-model="show" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}人员信息`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="() => formRef?.validate().then(() => uploadRef?.submit())">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="姓名">
        <el-input v-model="row.name" />
      </el-form-item>

      <el-form-item label="部门" :rules="{ required: true, message: '不能为空' }" prop="department.id">
        <el-select v-model="row.department" value-key="id">
          <el-option v-for="i in departmentList" :key="i.id" :label="i.departmentName" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="nickname">
        <el-radio-group v-model="row.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" w="3/4" prop="phone" :rules="{ pattern: /^\d{11}$/, message: '请输入正确的手机号', trigger: 'blur' }">
        <el-input v-model="row.phone" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="row.birthday"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item prop="photoName" label="照片">
        <VUpload ref="uploadRef" :photo-name="row.photoName" :on-success="onSuccess" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
