const {
  wxRequest
} = require('./util.js')
const {
  ERROR_CODE
} = require('../config/constants.js')

const app = getApp()

/**
 * 获取登录用户信息
 */
async function getUser() {
  return wxRequest({
    method: 'GET',
    url: '/manager-api/user/getUser'
  }).then(res => {
    app.globalData.user.id = res.userId
    app.globalData.user.tenantId = res.tenantId
  })
}

module.exports = {
  getUser
}