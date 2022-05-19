import { $fetch } from 'ohmyfetch'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { useUserStore } from '~/stores/user'
export const baseURL = '/api'

const whiteList = ['/api/sys/user/queryUserRole']
const _fetch = $fetch.create({
  baseURL,
  async onRequest({ options }) {
    NProgress.start()
    const userStore = useUserStore()
    options.headers = { Authorization: userStore.token }
  },
  async onResponse({ response, options, request }) {
    NProgress.done()
    const data = response._data

    if (['blob', 'text'].includes(options.responseType!))
      return

    if (data.code === 200 || whiteList.includes(request.toString())) {
      response._data = {
        message: data.msg,
        data: data.data.records || data.data,
        total: data.data.total,
      }
      return
    }

    options?.params?.noMessage || ElMessage({ message: data.msg || '服务器错误', type: 'error' })

    if (response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
    }
  },
})

export const request = <T>(...args: Parameters<typeof _fetch>) => _fetch<{
  data: T
  message: string
  total: number
}>(...args)
