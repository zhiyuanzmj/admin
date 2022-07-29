<script setup lang="tsx">
import type { Column } from '~/composables'
import type { Department } from '~/pages/person/department/api'
import { getDepartment, getDepartmentList } from '~/pages/person/department/api'
const { column } = defineProps<{
  index: number
  column: Column
}>()

let department = $ref<Department>({ })
onMounted(async () => {
  await nextTick()
  column.value && getDepartment(column.value).then(i => department = i.data)
})

async function load(node: any, resolve: any) {
  if (node.level === 0)
    return resolve(await getDepartmentList({ pageIndex: 1, pageSize: 99999 }).then(i => i.data))
  if (!node.data.hasChildren)
    return resolve([])
  const { data } = await getDepartmentList({ parent: node.data.id, pageIndex: 1, pageSize: 99999 })
  resolve(data)
}

const getList = inject('getList', () => {})

const model = computed({
  get() {
    return department
  },
  set(val: Department) {
    department = val
    column.value = val.id
  },
})
</script>

<template>
  <el-tree-select
    v-model="model"
    clearable
    collapse-tags
    :render-after-expand="false"
    node-key="id"
    :props="{
      label: 'departmentName',
      isLeaf: (data:any) => !data.hasChildren,
    }"
    :load="load"
    lazy
    :default-expanded-keys="department.parentIds"
    @clear="getList"
    @update:model-value="getList()"
  >
    <template #default="{ data }">
      <span v-if="data.hasChildren">{{ data.departmentName }}</span>
      <el-option v-else :label="data.departmentName" :value="data" />
    </template>
  </el-tree-select>
</template>
