<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { FoodTypeRow } from '../../food-type/api'
import { fetchFoodTypeList } from '../../food-type/api'
import type { FoodRow } from '../api'
import { post, put } from '../api'
import VUpload from '~/components/VUpload.vue'

const props = defineProps<{
  show: boolean
  row: FoodRow
}>()
const row = $ref(cloneDeep({ ...props.row, password: '' }))
let show = $(useVModel(props, 'show'))
const getList = inject('getList', () => {})
const formRef = $shallowRef<FormInstance>()

let foodTypeList = $ref<FoodTypeRow[]>()
async function getFoodTypeList() {
  ({ data: foodTypeList } = await fetchFoodTypeList({ pageIndex: 1, pageSize: 1000 }))
}
getFoodTypeList()

async function submit() {
  await formRef?.validate()
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
</script>

<template>
  <el-dialog v-model="show" custom-class="!w-2xl" :title="`${row.id ? '修改' : '添加'}人员信息`">
    <el-form ref="formRef" label-width="auto" :model="row" @submit.prevent="submit">
      <el-form-item :rules="[{ message: '不能为空', required: true }]" prop="name" label="名称">
        <el-input v-model="row.name" />
      </el-form-item>

      <el-form-item label="类型" :rules="{ required: true, message: '不能为空' }" prop="foodEnums">
        <el-select v-model="row.foodEnums" multiple value-key="id">
          <el-option v-for="i in foodTypeList" :key="i.id" :label="i.enumName" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="能量" w="3/4" prop="calorie">
        <el-input v-model="row.calorie" type="number" />
      </el-form-item>

      <el-form-item prop="photoName" label="图片">
        <VUpload :photo-name="row.photoName" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">确认提交</el-button>
        <el-button @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
