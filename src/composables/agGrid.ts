import type { LocationQueryValue } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { omit, pick } from 'lodash/fp'
import type { ColDef, ColumnApi, ColumnPinnedEvent, ColumnState, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import TableSet from '~/components/TableSet.vue'
import { isDark } from '~/composables'

interface Option { label?: string; value?: string | number }
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
  type Params<T> = Overwrite<ICellRendererParams, { data: T ; colDef: ColDef }>
export type Column<T = object> = Overwrite<ColDef, {
  value?: string
  field: Exclude<keyof T | 'select' | 'actions', number | symbol>
  unCheck?: boolean
  hide?: boolean
  order?: string
  options?: ((rest: Record<string, any>) => Promise<{ data: Option[]; total: number }>) | Option[]
  form?: {
    type?: 'switch' | 'radio' | 'checkbox' | 'date' | 'input' | 'select' | 'selectTree' | 'textarea'
    width?: string
    props?: any
  }
  valueGetter?: ((params: Overwrite<ValueGetterParams, { data: T }>) => any) | string
  cellRenderer?: { setup: ({ params }: { params: Params<T> }) => any }
}>

export const useAgGrid = function <T=any>(
  getColumnList: () => Column<T>[],
  fetchList: (rest: any) => Promise<{
    data: T[]
    total: number
  }>,
  defaultColDef?: ColDef,
) {
  const router = useRouter()
  const route = useRoute()
  const name = route.name as string
  const columnList = reactive(getColumnList())
  provide('columnList', columnList)
  const gridApi = shallowRef<GridApi>()
  provide('gridApi', gridApi)
  const columnApi = shallowRef<ColumnApi>()
  provide('columnApi', columnApi)
  const selectedList = ref<T[]>([])
  provide('selectedList', selectedList)
  const list = ref<T[]>([])
  provide('list', list)
  const total = ref(0)
  provide('total', total)

  const defaultValue = columnList.reduce((a: any, b) => (b.value && (a[b.field] = b.value), a), {})
  const params = computed(() => columnList.reduce((a: any, b) => {
    if (b.field.includes(','))
      b.field.split(',').forEach((v, index) => a[0][v] = (<string>route.query?.[b.field])?.split(',')[index] || b.value?.split(',')[index])
    else
      a[0][b.field] = b.value || undefined
    a[1][b.field] = defaultValue[b.field] === b.value ? undefined : b.value || undefined
    return a
  }, [{}, {}]))

  async function getList(data?: any) {
    gridApi.value?.showLoadingOverlay?.()
    await router.replace({ query: { ...route.query, ...params.value[1] } })
    const { pageIndex = '1', pageSize = '50', order, sort } = route.query
    const result = await fetchList({ pageIndex, pageSize, order, sort, ...params.value[0], ...data }).finally(() => gridApi.value?.hideOverlay?.())
    list.value = (result?.data ?? []) as any
    total.value = result?.total ?? 0
    selectedList.value = gridApi.value!.getSelectedRows()

    await nextTick()
    autoSizeAll()
    gridApi.value?.refreshCells({ force: true })
  }
  provide('getList', getList)
  provide('selectAll', () => gridApi.value?.selectAll())
  provide('deselectAll', () => gridApi.value?.deselectAll())

  const initMap = pick(['unCheck', 'field', 'hide', 'pinned'])
  const initColumnList = columnList.map(initMap)
  const columnStore = useStorage(name, initColumnList)
  const columnStoreOrigin = useStorage(`_${name}`, initColumnList)
  if (!columnStore.value || JSON.stringify(initColumnList) !== JSON.stringify(columnStoreOrigin.value))
    columnStoreOrigin.value = columnStore.value = initColumnList

  function initStorage() {
    columnStore.value = reactive(getColumnList()).map(initMap)
    gridApi.value?.setColumnDefs([])
    gridApi.value?.setColumnDefs(getColumnDefs())
    autoSizeAll()
  }
  provide('initStorage', initStorage)

  provide('columnStore', columnStore)
  function getColumnDefs() {
    // ??????????????????
    const order = (<LocationQueryValue>route.query.order)?.split(',')
    const sort = (<LocationQueryValue>route.query.sort)?.split(',')
    const lastField = columnStore.value.filter(i => !i.hide).at(-1)?.field
    return columnStore.value.map((column) => {
      const option = columnList.find(item => item.field === column.field)!
      order?.forEach((o, index) => {
        if (option?.field === o)
          option.sort = sort?.[index] as 'asc' | 'desc'
      })
      if (column.field === lastField)
        option.headerComponent = TableSet
      return Object.assign(option, column)
    }) as ColDef[]
  }
  provide('getColumnDefs', getColumnDefs)

  /** ???????????????????????? */
  async function autoSizeAll() {
    if (!columnApi.value)
      return
    // ??????????????????????????? ???????????????
    if (route.name !== name)
      return
    columnApi.value.autoSizeAllColumns(false)

    // @ts-expect-error ?????????????????? ????????????????????????????????????
    const width = gridApi.value?.gridBodyCtrl.eBodyViewport.scrollWidth
      - columnApi.value
        .getAllDisplayedColumns()
        .map(i => i.getActualWidth())
        .reduce((a, b) => a + b, 0)
    if (width <= 0)
      return

    columnApi.value.getAllDisplayedColumns().filter(i =>
      !i.getColDef().maxWidth && !i.getColDef().suppressSizeToFit,
    ).forEach((i, _, list) => {
      columnApi.value?.setColumnWidth(i, i.getActualWidth() + width / list.length)
    })
  }
  provide('autoSizeAll', autoSizeAll)

  const row = ref({} as T)

  const agGridBind = reactive<GridOptions & { class: any }>({
    // rowBuffer: 1,
    rowData: list as any,
    class: computed(() => `flex-1 ag-theme-alpine${isDark.value ? '-dark' : ''}`),
    animateRows: true,
    rowSelection: 'multiple',
    suppressDragLeaveHidesColumns: true,
    suppressColumnVirtualisation: true,
    enableCellTextSelection: true,
    alwaysMultiSort: true,
    // enableCellChangeFlash: true,
    getRowId: ({ data }) => data?.id,
    defaultColDef: {
      sortable: true,
      resizable: true,
      comparator: () => 0,
      ...defaultColDef,
    },
    context: {
      initStorage,
      columnApi,
      autoSizeAll,
      columnStore,
    },
  })

  const agGridOn = {
    /** table ?????????document?????? */
    async gridReady(params: GridReadyEvent) {
      gridApi.value = params.api
      columnApi.value = params.columnApi
      gridApi.value?.setColumnDefs(getColumnDefs())
      getList()
    },
    /** ?????????????????????????????? ????????????????????? */
    gridSizeChanged: autoSizeAll,
    /** ?????? */
    async sortChanged() {
      const model = columnApi.value?.getColumnState()
        .reduce((a: ColumnState[], b) => (b.sort && a.push(b), a), [])
        .sort((a, b) => a.sortIndex! - b.sortIndex!)

      const query = model?.length
        ? { order: model.map(i => i.colId).join(','), sort: model.map(i => i.sort).join(',') }
        : omit(['order', 'sort'], route.query)
      await router.replace({ query })
      getList()
    },
    /** ??????????????? */
    columnPinned({ column, pinned }: ColumnPinnedEvent) {
      const item = columnStore.value.find(i => column?.getColId() === i.field)
      if (item)
        item.pinned = pinned
    },
    /** ??????????????? */
    columnMoved() {
      if (!columnApi.value)
        return
      columnStore.value = columnApi.value.getAllGridColumns().map((i) => {
        const { unCheck, field } = columnList.find(column => column.field === i.getColId())!
        return { unCheck, field, hide: !i.isVisible(), pinned: i.getPinned() }
      })
    },
    /** ??????????????? ????????????????????? */
    rowDataChanged: autoSizeAll,
    /** select ?????? */
    selectionChanged() {
      selectedList.value = gridApi.value!.getSelectedRows()
    },
    rowClicked: ({ data }: any) => row.value = data,
  }

  return {
    row,
    columnList,
    selectedList,
    gridApi,
    columnApi,
    params: computed(() => params.value[0]),
    getList,
    list,
    total,
    agGridBind,
    agGridOn,
  }
}
