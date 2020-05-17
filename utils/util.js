const {
  env,
  version,
} = require('../config/config')

/**
 * 时间格式化
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的请求接口
 */
const wxRequest = param => {
  return new Promise((resolve, reject) => {
    wx.request({
      // 如果设置了完整路径, 则使用完整路径, 否则将服务器地址和接口地址进行拼接
      url: param.fullUrl || env.server + param.url,
      // 请求类型, 默认为 GET
      method: param.method || 'GET',
      header: Object.assign({
        'App-Version': version,
        'Authorization': wx.getStorageSync("token") || "",
        'Content-Type': 'application/json',
        'UserAgent': 'MINI'
      }, param.header || {}),
      // 请求参数
      data: param.data || {},
      // 请求成功的回调方法
      success: res => {
        if (res.statusCode === 401) {
          if (!res || !res.data) {
            reject(res)
          }

          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/index/login',
            })
          }, 3000)
          return
        }

        if (res.statusCode === 403) {
          wx.showToast({
            title: '请重新选择身份',
            icon: 'none',
            duration: 3000,
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/role/select-role',
            })
          }, 3000)
          return
        }

        if (!res || !res.data) {
          reject(res)
        }

        if (res.data && (res.data.code || res.data.resultCode)) {
          resolve(res.data)
        } else {
          setTimeout(() => {
            wx.showToast({
              title: "服务异常，请稍后再试",
              icon: 'none',
            })
          }, 500)
          reject(res.data)
        }
      },
      fail: res => {
        // 判断当前网络情况
        wx.getNetworkType({
          success(res) {
            let msg = ''

            if (res.networkType === 'none') {
              msg = '当前无网络'
            } else {
              msg = '加载失败，请稍后重试'
            }

            wx.showToast({
              title: msg,
              icon: 'none'
            })
          },
          fail() {
            wx.showToast({
              title: '获取网络状态失败',
              icon: 'none'
            })
          }
        })

        reject(res)
      },
    })
  })
}

const wxUpload = param => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: env.uploadUrl,
      filePath: param.filePath,
      name: 'file',
      header: {
        'Authorization': wx.getStorageSync("token") || "",
        'UserAgent': 'MINI'
      },
      success: (res) => {
        if (res.statusCode === 401) {
          if (!res || !res.data) {
            reject(res)
          }

          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/index/login',
            })
          }, 3000)
          return
        }

        resolve(res)
      },
      fail: (err) => {
        // 判断当前网络情况
        wx.getNetworkType({
          success(res) {
            let msg = ''

            if (res.networkType === 'none') {
              msg = '当前无网络'
            } else {
              msg = '加载失败，请稍后重试'
            }

            wx.showToast({
              title: msg,
              icon: 'none'
            })
          },
          fail() {
            wx.showToast({
              title: '获取网络状态失败',
              icon: 'none'
            })
          }
        })

        reject(err)
      }
    })
  })
}

/**
 * 获取文件扩展名
 */
function getFileExpandedName(filepath) {
  if (filepath != '') {
    return filepath.replace(/.+\./, '')
  } else {
    return ''
  }
}

/**
 * 获取文件大小, 小于1G显示xx M, 小于1M显示xx K,小于1K显示xx B
 * size: b
 */
function getFormatFileSize(size) {
  if (size > 1 << 30) {
    return Math.floor(size * 10 / (1 << 30)) / 10 + 'G'
  } else if (size > 1 << 20) {
    return Math.floor(size * 10 / (1 << 20)) / 10 + 'M'
  } else if (size > 1 << 10) {
    return Math.floor(size * 10 / (1 << 10)) / 10 + 'k'
  } else {
    return size + 'b'
  }
}

/**
 * 截取
 * @param str
 * @param len
 */
function cutString(str, len, tail) {
  if (str == null || str.length === 0) {
    return ''
  }
  str = String(str)
  // 最后追加的字符串, 默认为 '…'
  tail = tail ? tail : '…'
  // 如果要截取长度为0的字符串, 那就直接返回空字符串.
  if (len === 0) {
    return ''
  }

  // 如果字符串长度小于要截取的长度, 返回字符串本身.
  if (str.length <= len) {
    return str
  }

  // 如果结束字符为表情等特殊字符, 会占用4个字节
  // 此时要进行判断.
  let strEnd = len
  if (str.codePointAt(len - 1) > 0xffff) {
    strEnd = len + 1
  }
  return str.substring(0, strEnd) + tail
}

/**
 * 拼接跳转路径
 */
function jumpTo(route) {
  let {
    url,
    data,
    reLaunch
  } = route
  let arr = []

  for (let key in data) {
    arr.push(key + '=' + encodeURIComponent(data[key]))
  }

  if (arr.length) {
    url = url + '?' + arr.join('&')
  }

  if (reLaunch) {
    wx.reLaunch({
      url: url
    })
  } else {
    wx.navigateTo({
      url: url
    })
  }
}

/**
 * 根据文件类型(扩展名) 获取文件图标
 */
function getFileIconByType(type) {
  if (type === 'pdf') {
    return '/assets/img/file/pdf.svg'
  } else if (type === 'doc' || type === 'docx') {
    return '/assets/img/file/word.svg'
  } else if (type === 'xls' || type === 'xlsx') {
    return '/assets/img/file/excel.svg'
  } else if (type === 'txt') {
    return '/assets/img/file/txt.svg'
  } else {
    return '/assets/img/file/unknown-file.svg'
  }
}

/**
 * 获取url中的参数
 */
function getParams(url) {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * 更新角色相关数据
 */
function updateRole(role) {
  const roles = require('../config/role.js')
  const router = require('../router/router.js')

  const app = getApp()

  app.globalData.user.role = role
  app.globalData.api = roles[role].api
  app.globalData.router = Object.assign({}, router, roles[role].router)
  app.globalData.tabBar = roles[role].tabBar

  let roleList = JSON.parse(wx.getStorageSync('rightList'))
  for (let i = 0; i < roleList.length; i++) {
    if (roleList[i].id === role) {
      app.globalData.rightCodeList = roleList[i].rightCodeList
    }
  }

  wx.reLaunch({
    url: roles[role].router.home,
  })
}
/**
 * 深拷贝对象
 * @param {*} target 
 */
function deepClone(target) {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值    
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
}

module.exports = {
  formatTime,
  wxRequest,
  getFileExpandedName,
  cutString,
  jumpTo,
  getFormatFileSize,
  getFileIconByType,
  getParams,
  updateRole,
  wxUpload,
  deepClone
}
