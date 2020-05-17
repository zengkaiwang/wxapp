/**
 * 接口响应状态描述
 */
const ERROR_CODE = {
  SUCCESS: 'Success',
  SERVER_ERROR: 'ServerError',
  AUTH_MISTAKE: 'AuthMistake',
  REDIS_ERROR: 'RedisError',
  PARAM_MISTAKE: 'ParamMistake',
  OUT_OF_DATE_WARNING: 'OutOfDateWarning'
}

/**
 * 接口响应状态代码
 */
const ERROR_CODE_NUMBER = {
  SUCCESS: 100200,
  SERVER_ERROR: 100500,
  AUTH_MISTAKE: 100401,
  REDIS_ERROR: 100501,
  PARAM_MISTAKE: 100405,
  FIST_LOGIN: 100300
}

module.exports = {
  ERROR_CODE,
  ERROR_CODE_NUMBER
}