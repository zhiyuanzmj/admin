import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
export function resolve(val: string) {
  return val.replace(/\/$/, '')
}

export default defineStore('tagsview', {
  state: () => ({
    viewKey: 0,
    cachedViews: [] as string[],
    visitedViews: JSON.parse(localStorage.getItem('visitedViews') || '[]') as RouteLocationNormalized[],
  }),
  getters: {
    to: state => (view: RouteLocationNormalized | RouteRecordRaw) => state.visitedViews.find(i => i.name === view.name || i.path === view.path) || view,
  },
  actions: {
    addView(view: RouteLocationNormalized) {
      const val = cloneDeep(view)
      this.addVisitedView(val)
      this.addCachedView(val)
    },
    addVisitedView(view: RouteLocationNormalized) {
      if (this.visitedViews.some(v => resolve(v.path) === resolve(view.path)))
        return
      this.visitedViews.push(view)
    },
    addCachedView(view: RouteLocationNormalized) {
      if (this.cachedViews.includes(view?.name as string))
        return
      if (!view.meta?.noCache && view?.name)
        this.cachedViews.push(view?.name as string)
    },
    dropView(view: RouteLocationNormalized) {
      this.dropVisitedView(view)
      this.dropCachedView(view)
    },
    dropVisitedView(view: Partial<RouteLocationNormalized>) {
      const index = this.visitedViews.findIndex(v => resolve(v.path) === resolve(view.path!))
      if (index >= 0)
        this.visitedViews.splice(index, 1)
    },
    dropCachedView(view: Partial<RouteLocationNormalized>) {
      const index = this.cachedViews.indexOf(view.name as string)
      index > -1 && this.cachedViews.splice(index, 1)
    },
    delOthersViews(view?: RouteLocationNormalized) {
      this.visitedViews = this.visitedViews.filter(v => v.path === view?.path)
      this.cachedViews = this.cachedViews.filter(v => v !== view?.name)
    },
    goBack(to?: Partial<RouteLocationNormalized>) {
      this.dropVisitedView(this.route)
      this.dropCachedView(this.route)
      if (to?.name === this.route.name)
        return this.viewKey++
      if (to) {
        this.dropCachedView(to)
        this.router.push(this.to(to as RouteLocationNormalized))
      }
      else {
        this.router.go(-1)
      }
    },
    refresh() {
      this.viewKey++
    },
  },

})
