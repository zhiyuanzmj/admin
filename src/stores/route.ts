import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from './user'
import { useTagsviewStore } from './tagsview'
import routes from '~pages'

/**
 * Use meta.role to determine if the current user has permission
 * @param permissions
 * @param route
 */
function hasPermission(permissions: any[] = [], route: RouteRecordRaw) {
  if (!route.meta?.permission)
    return true

  // if (route.meta?.permission.startsWith('white'))
  // return permissions.some(permission => route.meta?.permission === (`white${permission}`))

  if (route.children)
    return filterAsyncRoutes(route.children, permissions).length
  else
    return permissions.includes(route.meta?.permission)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes
 * @param permissions
 */
function filterAsyncRoutes(routes: RouteRecordRaw[], permissions: string[] = []) {
  const res: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children)
        tmp.children = filterAsyncRoutes(tmp.children, permissions)

      res.push(tmp)
    }
  })

  return res
}

const getList = (routes: RouteRecordRaw[]) =>
  routes.filter((i) => {
    if (i.children)
      i.children = getList(i.children)
    return !i.meta?.hidden
  })

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [] as RouteRecordRaw[],
    removeRouteList: [] as Function[],
  }),
  getters: {
    list: state => getList(cloneDeep(state.routes)),
  },
  actions: {
    async generateRoutes() {
      const userStore = useUserStore()
      const permissionList = await userStore.getPermissionList()
      // 删除所有添加的动态路由 防止出现白屏: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0029-router-dynamic-routing.md
      this.removeRouteList.forEach(i => i())
      this.routes = filterAsyncRoutes(setupLayouts(routes.filter(i => i.meta?.permission)), permissionList)
      this.removeRouteList = this.routes.map(route => this.router.addRoute(route))

      /** 过滤无权限的路径 */
      const tagsView = useTagsviewStore()
      tagsView.visitedViews = tagsView.visitedViews.filter(i => this.router.hasRoute(i.name!))
      tagsView.cachedViews = []
    },
  },

})
