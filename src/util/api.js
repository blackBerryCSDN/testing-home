import axios from 'axios'
import {getCookie, setCookie} from './util'
// import router from '../router/index'
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

function checkStatus (response) {
  if (response != null) {
    if (response.status === 200 || response.status === 304) {
      return response
    } else if (response.status === 401) {
    // 没有权限，已经登录正常，需要刷新token,刷新页面 刷新
      console.log('权限错误》》》》》》》》》')
      setCookie('loginToken', 'false')
      window.location.reload()
      // router.push({ path: '/login' })
      return response
    }
  }
  return {

    data: {
      code: -404,
      data: {},
      message: '错误信息！！！请检查后台是否开启……'
    }
  }
}

function checkCode (res) {
  if (res.data.code !== 200 && res.data.code !== 0) {
    // alert(res.data.message)
    console.log('---返回错误数据----')
    console.log(res.data)
  }
  return res
}

// post get请求封装方法
export default {
  post (url, data) {
    return axios({
      method: 'post',
      url,
      data: JSON.stringify(data),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getCookie('loginToken')
      }
    }).then(checkStatus).then(checkCode)
  },
  get (url, params) {
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': getCookie('loginToken')
      }
    }).then(checkStatus).then(checkCode)
  }
}
