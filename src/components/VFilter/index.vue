<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import type { FormInstance } from 'element-plus'
import FilterInput from './FilterInput.vue'
import FilterSelect from './FilterSelect.vue'
import FilterSelectTree from './FilterSelectTree.vue'
import FilterRadio from './FilterRadio.vue'
import FilterToggle from './FilterToggle.vue'
import FilterCheckbox from './FilterCheckbox.vue'
import FilterDate from './FilterDate.vue'
import type { Column } from '~/composables'

const { formWidth = '250px' } = defineProps<{ formWidth?: string }>()

const getColumnDefs = inject('getColumnDefs', (): Column[] => [])
const columnListRef = computed(() =>
  getColumnDefs().filter(i => Reflect.has(i, 'value')),
)

const getListInject = inject('getList', (object: any) => {})
async function getList() {
  getListInject({ pageIndex: 1 })
}
provide('getList', getList)

const formRef = $ref<FormInstance>()
async function reset() {
  formRef.resetFields()
  getList()
}

const extend = ref()
const height = ref('')
useResizeObserver(extend.value, ([entry]) => {
  height.value = `${entry.target.scrollHeight}px`
})

const columnRef = ref<any>([])
const extendable = ref(false)
const show = ref(false)
const route = useRoute()
onMounted(() => {
  columnListRef.value.forEach((column) => {
    column.value = route.query?.[column.field] as string || column.value
  })

  if (!columnRef.value?.length)
    return
  useIntersectionObserver(columnRef.value[columnRef.value.length - 1], ([{ isIntersecting }]) => {
    if (show.value)
      return
    extendable.value = !isIntersecting
  })
})
</script>

<template>
  <el-form ref="formRef" class="flex flex-nowrap" :model="columnListRef" label-width="auto" label-position="left" @submit.prevent="getList" @reset="reset">
    <div :key="height" ref="extend" class="v-extend gap-5 mb-1" :class="{ active: show }">
      <el-form-item
        v-for="(column, i) in columnListRef"
        :key="column.field"
        :ref="(e:any) => (columnRef[i] = e)"
        :label="column.headerName"
        :prop="`${i}.value`"
      >
        <component
          :is="column.form?.type === 'switch' ? FilterToggle
            : column.form?.type === 'checkbox' ? FilterCheckbox
              : column.form?.type === 'selectTree' ? FilterSelectTree
                : column.form?.type === 'date' ? FilterDate
                  : column.options ? column.form?.type === 'radio' ? FilterRadio : FilterSelect
                    : FilterInput"
          :index="i"
          :label="column.headerName"
          v-bind="column.form?.props"
          :style="{ width: column.form?.width || formWidth }"
          :column="column"
        />
      </el-form-item>
    </div>
    <div class="ml-auto self-start flex flex-nowrap items-center whitespace-nowrap">
      <slot v-bind="{ getList }">
        <el-button v-if="extendable || show" type="primary" text mr="-3" @click="show = !show">
          <template #icon>
            <i :class="show ? 'i-ep:arrow-up-bold' : 'i-ep:arrow-down-bold'" />
          </template>
          {{ show ? '收起' : '更多' }}
        </el-button>
        <el-button native-type="reset">重置</el-button>
        <el-button type="primary" native-type="submit">查询</el-button>
      </slot>
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
.v-extend {
  display: flex;
  flex-wrap: wrap;
  max-height: 34px;
  overflow: hidden;
  transition: max-height 0.25s;

  &.active {
    max-height: v-bind(height);
  }
}

.el-form-item {
  margin-bottom: 0;
}
</style>
