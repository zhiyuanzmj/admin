import type { AxiosRequestConfig } from 'axios'
import Axios from 'axios'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { useUserStore } from '~/stores/user'
export const baseURL = '/api'
const axios = Axios.create({ baseURL })

axios.interceptors.request.use((config) => {
  NProgress.start()
  const userStore = useUserStore()
  if (userStore.token && config.headers)
    config.headers['X-Access-Token'] = userStore.token
  return config
})
const whiteList = ['/sys/user/queryUserRole']
axios.interceptors.response.use(
  (response) => {
    const data = response.data

    if (data.code === 401) {
      const userStore = useUserStore()
      userStore.logout()
      return Promise.reject(data)
    }
    if (['blob', 'text'].includes(response.config.responseType!))
      return response
    if (data.code === 0 || data.code === 200 || whiteList.includes(response.config.url as string)) {
      response.data = {
        message: response.data.message,
        data: response.data.result?.records ?? response.data.result,
        total: response.data.result?.total,
      }
      return response
    }
    response.config?.params?.noMessage || response.config.data?.noMessage || ElMessage({ message: data?.message || '服务器错误', type: 'error' })
    NProgress.done()
    return Promise.reject(data)
  },
  async (error) => {
    const response = error.response
    if (['blob', 'text'].includes(response.config.responseType!))
      response.data = JSON.parse(await response.data.text())

    response.config?.params?.noMessage || response.config.data?.noMessage || ElMessage({ message: response?.data?.message || response?.data?.error || '服务器错误', type: 'error' })
    if (response?.data?.message === 'Token失效，请重新登录') {
      const userStore = useUserStore()
      userStore.logout()
      response.data = { data: {}, message: response?.data?.message }
    }

    NProgress.done()
    return Promise.reject(response.data)
  },
)

export { axios }

export function request<T=any>(rest: AxiosRequestConfig) {
  return axios(rest).then(i => i.data as {
    data: T
    message: string
    total: number
  })
}
