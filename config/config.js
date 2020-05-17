const ENV = {
  LOCAL_MOCK: {
    server: 'http://10.112.89.249:7000',
    downloadUrl: 'http://10.122.61.206:8800/file-api/file-server/saas/download/',
    uploadUrl: 'http://10.122.61.201:8090/file-api/file-server/saas/add/',
  },
  DEVELOPMENT: {
    server: 'https://wxapp.wzk.com.cn',
    downloadUrl: 'https://wxapp.wzk.com.cn/file-api/file-server/saas/download/',
    uploadUrl: 'https://wxapp.wzk.com.cn/file-api/file-server/saas/add/',
  },
  TEST: {
    server: 'https://wxapptest.wzk.com.cn',
    downloadUrl: 'https://wxapp.wzk.com.cn/file-api/file-server/saas/download/',
    uploadUrl: 'https://wxapp.wzk.com.cn/file-api/file-server/saas/add/',
  },
  PRODUCTION: {
    server: 'https://wxgw.wzk.com.cn',
    downloadUrl: 'https://wxgw.wzk.com.cn/file-api/file-server/saas/download/',
    uploadUrl: 'https://wxgw.wzk.com.cn/file-api/file-server/saas/add/',
  }
}

module.exports = {
  env: ENV.DEVELOPMENT,
  version: '0.0.1' // 发布版本号
}