import { useRouteStore } from '~/stores/route'
import { useUserStore } from '~/stores/user'
import type { UserModule } from '~/types'

function handleKeepAlive(to: any) {
  if (to.matched?.length <= 2)
    return
  for (let i = 0; i < to.matched.length; i++) {
    const element = to.matched[i]
    if (element?.components?.default?.name === 'KeepAlive') {
      to.matched.splice(i, 1)
      handleKeepAlive(to)
    }
  }
}

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(async (to, from) => {
      /** 没有token 跳到登陆页 */
      const userStore = useUserStore()
      if (!userStore.token)
        return to.meta.white ? true : { name: 'login' }
      if (to.name === 'login')
        return '/'

      if (!userStore.permissionList?.length) {
        await useRouteStore().generateRoutes()
        return to.fullPath
      }

      /** 生成动态路由 */
      handleKeepAlive(to)
    })
  }
}
