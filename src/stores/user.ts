import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import { useRouteStore } from './route'
// import { useColumnStore } from './column'
import { request } from '~/composables/request'

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    permissionList: [] as string[],
  }),
  actions: {
    async login(data: any) {
      const loading = ElLoading.service({ fullscreen: true })
      const { data: { token, userInfo } } = await request({
        method: 'post',
        url: '/sys/login',
        data,
      })
        .catch(() => ({ data: { token: '1', userInfo: {} } }))
        .finally(() => loading.close())

      this.token = token
      this.userInfo = userInfo
      this.router.push(<string> this.route.query.redirect || '/')
    },
    async getPermissionList() {
      /** 获取用户自定义列设置 */
      // const { getColumnStore } = useColumnStore()
      // const columnStoreAsync = getColumnStore()
      // await columnStoreAsync
      const loading = ElLoading.service({ fullscreen: true })
      const { data: { permission } } = await request({
        url: '/sys/permission/getUserPermissionByToken',
      })
        .catch(() => ({ data: { permission: [{ url: '/get/user' }] } }))
        .finally(() => loading.close())
      return this.permissionList = permission.map((i: any) => i.url)
    },
    hasPermission(val: string) {
      return this.permissionList.includes(val)
    },
    async logout() {
      this.token = ''
      this.permissionList = []
      this.router.push({ path: '/login', query: { redirect: this.route.fullPath } })
      useRouteStore().removeRouteList.forEach(i => i())
    },
  },
})
