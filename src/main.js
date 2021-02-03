// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'
import global_ from './util/global'
// 路由模块
import VueResource from 'vue-resource'
import './icons'
Vue.use(VueResource)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false
// 全局注册，使用方法为:this.$axios
Vue.prototype.$axios = axios
// 全局注册，使用方法为:this.qs
Vue.prototype.qs = qs
Vue.prototype.GLOBAL = global_
// axios.defaults.baseURL = global_.BASE_URL
//
Vue.directive('loadmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
      let sign = 0
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
