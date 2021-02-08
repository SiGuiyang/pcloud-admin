import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import Constants from '@/utils/constants'
import { getToken } from '@/utils/auth'


NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/404', '/401', '*', '/dashboard'] // whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken(Constants.access_token)) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.permissions.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const routers = res.data.routers
          store.dispatch('GenerateRoutes', { routers }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else { // 未登陆
    if (to.path !== '/dashboard' && whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
