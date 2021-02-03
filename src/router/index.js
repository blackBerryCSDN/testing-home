import Vue from 'vue'
import VueRouter from 'vue-router'
import {setCookie, getCookie, getHttpParams} from '../util/util'
import GLOBAL from '../util/global'
import api from '../util/api'
Vue.use(VueRouter)

// 这里面负责写路由映射，便于管理
// 创建路由实例并配置路由映射
// path:'*',redirect:'/home'  重定向到path是/home的映射 */
const router = new VueRouter({
  routes: [
    {
      // 默认跳转到login 页面
      path: '/',
      components: require('../pages/login/index.vue')
    },
    {
      // 指定到login 页面
      path: '/login',
      components: require('../pages/login/index.vue')
    },
    {
      // 业务体验
      path: '/business',
      components: require('../pages/business/index.vue')
    },
    {
      // 故障分析
      path: '/fault',
      components: require('../pages/fault/index.vue')
    },
    {
      // 综合质量
      path: '/comprehensive',
      components: require('../pages/comprehensive/index.vue')
    },
    {
      // 探针状态-全网概况
      path: '/probe',
      components: require('../pages/probe/general.vue')
    },
    {
      // 在网详情
      path: '/online',
      components: require('../pages/onLine/index.vue')
    },
    // {
    //   // 申请工单
    //   path: '/order',
    //   components: require('../pages/order/index.vue')
    // },
    {
      // 新建工单
      path: '/add',
      components: require('../pages/order/add.vue')
    },
    {
      // 代办工单
      path: '/transact',
      components: require('../pages/order/transact.vue')
    },
    {
      // 查询工单
      path: '/query',
      components: require('../pages/order/query.vue')
    },
    {
      // 返修统计
      path: '/statistics',
      components: require('../pages/order/statistics.vue')
    },
    {
      // 查询工单
      path: '/test',
      components: require('../pages/test/index.vue')
    },
    {
      // 告警
      path: '/warning',
      components: require('../pages/warning/offine.vue')
    },
    {
      // 工单管理
      path: '/order-manager',
      components: require('../pages/order/order-manager.vue')
    },
    {
      // 返修工单管理
      path: '/repair-manage',
      components: require('../pages/order/repair-manage.vue')
    },
    {
      // 返修工单管理详细
      path: '/manage-detail',
      components: require('../pages/order/manage-detail.vue')
    },
    {
      // 关于
      path: '/order-about',
      components: require('../pages/order/about.vue')
    },
    {
      path: '/tabbar',
      components: require('../components/tabbar.vue')
    },
    {
      // 通知消息
      path: '/message',
      components: require('../pages/message/index.vue')
    },
    // {
    //   // 拨测质量
    //   path: '/botest',
    //   components: require('../pages/boce/index.vue')
    // },
    {
      path: '/404',
      components: require('../components/404.vue')
    },
    {
      path: '*',
      components: require('../components/404.vue')
    }
  ]
})
// 不存在的页面跳转到404页面
router.beforeEach(async (to, from, next) => {
  console.log('跳转前验证，to.matched.length', to.matched.length)
  // 跳转数据，查看有
  if (to.matched.length === 0) { // 如果未匹配到路由
    from.name ? next({ name: from.name }) : next('/404') // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
  }
  if (to.path === '/login') {
    next()
    // return
  }
  next()
  // loginFlag 登录成功标志位  用于查看是否登录成功
/*  let loginToken = getCookie('loginToken')
  if (loginToken === null || loginToken === 'false') {
    // 登录失败，进行判断是否有wcsId，进行刷新token 或者登录请求
    if (window.sessionStorage.getItem('wcsId')) {
      // 有wcsId，进行刷新token /api/user/refresh
      let tokenRes = await getTokenWX(window.sessionStorage.getItem('wcsId'))
      console.log('刷新token成功，token值为：')
      console.log(tokenRes)
      // 刷新成功进行保存 loginToken值
      if (tokenRes.code === 0) {
        setCookie('loginToken', tokenRes.data.loginToken)
        window.sessionStorage.setItem('role', tokenRes.data.role)
        next()
      } else {
        //  刷新失败，状态：未关联微信id 进行重新登录   并进行跳转login
        next('/login')
      }
    } else {
      // 没有wcsId值，说明第一次登录 ----->>>>进行获取当前code值，请求登录接口 /api/user/login/wx
      let res = await getLoginWX(getHttpParams('code'))
      console.log(res)
      // 说明刚开始登录，进行保存跳转地址
      setCookie('toUrl', to.path)
      // 说明账号能够关联成功
      if (res.code === 0) {
        // 存储 loginToken的值 和 微信唯一码
        setCookie('loginToken', res.data.loginToken)
        window.sessionStorage.setItem('wcsId', res.data.wcsId)
        window.sessionStorage.setItem('role', res.data.role)
        window.sessionStorage.setItem('account', res.data.account)
        window.sessionStorage.setItem('mobile', res.data.mobile)
        next()
        // 说明账号未关联，保存当前跳转地址，并进行跳转login
      } else {
        console.log('其他错误')
        alert('获取openId失败，请退出重新访问')
      }
    }
  } else {
    // 登录成功，直接进行跳转
    next()
  } */
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
async function getLoginWX (codeData) {
  console.log('---------微信登录接口---------')
  console.log(codeData)
  let res = await api.post(GLOBAL.BASE_URL + '/api/user/login/wx', {code: codeData})
  return res.data
}

async function getTokenWX (wcsId) {
  console.log('---------微信刷新token接口---------')
  console.log(wcsId)
  let res = await api.post(GLOBAL.BASE_URL + '/api/user/refresh', {wcsId: wcsId})
  return res.data
}

export default router
