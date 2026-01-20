/**
 * 错误码管理模块
 * 统一管理 HTTP 状态码和业务错误码的映射关系
 */

// 需要重新登录的错误码列表
export const RELOAD_CODES = [401, 1011007, 1011008]

// HTTP 状态码错误信息映射
export const HTTP_ERROR_MAP = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  406: '请求的格式不可得',
  410: '请求的资源被永久删除',
  422: '创建对象时发生验证错误',
  500: '服务器错误，请稍后重试',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
  default: '网络请求失败，请稍后重试'
}

// 业务错误码映射（可根据实际业务扩展）
export const BIZ_ERROR_MAP = {
  1011007: '登录状态已过期',
  1011008: '账号在其他设备登录',
  // 更多业务错误码可以在这里添加
}

/**
 * 获取错误信息
 * @param {number|string} code - 错误码
 * @returns {string} 错误信息
 */
export function getErrorMessage(code) {
  // 优先查找业务错误码
  if (BIZ_ERROR_MAP[code]) {
    return BIZ_ERROR_MAP[code]
  }
  
  // 其次查找 HTTP 错误码
  if (HTTP_ERROR_MAP[code]) {
    return HTTP_ERROR_MAP[code]
  }
  
  // 返回默认错误信息
  return HTTP_ERROR_MAP.default
}

/**
 * 判断是否需要重新登录
 * @param {number|string} code - 错误码
 * @returns {boolean}
 */
export function shouldReload(code) {
  return RELOAD_CODES.includes(Number(code))
}
