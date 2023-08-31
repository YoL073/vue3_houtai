import { path } from 'path';
import setting from './setting';
// 路由鉴权，鉴权：项目中路由能不能被访问的权限(某一个路由什么条件下可以访问，什么条件下不可以被访问)
import router from '@/router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false });
// 获取用户相关的小仓库内部的token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user';
import pinia from './store';
import { el } from 'element-plus/es/locale/index.js';

let userStore = useUserStore(pinia)
// console.log(userStore);


// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start();
  // 获取token来判断用户是否登录
  let token = userStore.token

  let username = userStore.username
  // 用户登录判断
  if (token) {
    // 登陆成功，访问login不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功访问其余路由（登陆排除）
      // 有用户信息
      if (username) {
        // 放行 
        next()
      } else {
        // 没有用户信息，在守卫这里发请求获取到用户信息在放行
        try {
          // 获取用户信息
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期：获取不到用户信息
          // 用户手动修改本地token
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
  // next()
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})