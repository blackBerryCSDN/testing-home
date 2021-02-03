// 获取cookie、
export function getCookie (name) {
  var arr
  // beforeLoginUrl=/login; fromUrl=/
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return (arr[2])
  } else {
    return null
  }
}

// 设置cookie,增加到vue实例方便全局调用
export function setCookie (cName, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 删除cookie
export function delCookie (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 方法一 获取地址栏参数,仅支持 "?"传参方式
export function GetQueryString (sProp) {
  var re = new RegExp('[&,?]' + sProp + '=([^\\&]*)', 'i')

  var a = re.exec(document.location.search)

  if (a == null) {
    return ''
  }

  return a[1]
}

// 方法二 获取地址栏参数在解析时兼容"?" "#"两种传参方式。
export function getHttpParams (name) {
  var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)')

  var m = location.href.match(r)

  return decodeURIComponent(!m ? '' : m[2])
}

// 日期格式化
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

// 实现YYYY-MM-DD日期加上天数得到新的日期
export function getNewDay (dateTemp, days) {
  var nDate = new Date(dateTemp.replace(/-/g, '/'))
  var millSeconds = nDate.getTime() - (days * 24 * 60 * 60 * 1000)
  var rDate = new Date(millSeconds)
  var year = rDate.getFullYear()
  var month = rDate.getMonth() + 1
  if (month < 10) month = '0' + month
  var date = rDate.getDate()
  if (date < 10) date = '0' + date
  return (year + '-' + month + '-' + date)
}
