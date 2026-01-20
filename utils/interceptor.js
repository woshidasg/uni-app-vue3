/**
 * 路由拦截器模块
 * 统一拦截所有路由跳转，进行权限校验
 */

import { checkPermission } from './auth'

// 需要拦截的路由方法列表
const INTERCEPT_METHODS = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']

/**
 * 设置路由拦截器
 * 在 main.js 中调用此方法初始化路由拦截
 */
export function setupInterceptor() {
  INTERCEPT_METHODS.forEach(method => {
    uni.addInterceptor(method, {
      invoke(args) {
        // 提取路径（去除查询参数）
        const path = args.url.split('?')[0]
        
        // 执行权限检查
        const hasPermission = checkPermission(path)
        
        // 返回 false 将阻止路由跳转
        return hasPermission
      },
      fail(err) {
        console.error(`路由拦截失败 [${method}]:`, err)
      }
    })
  })
  
  console.log('路由拦截器已启用')
}

/**
 * 移除路由拦截器
 * 如需禁用拦截器可调用此方法
 */
export function removeInterceptor() {
  INTERCEPT_METHODS.forEach(method => {
    uni.removeInterceptor(method)
  })
  
  console.log('路由拦截器已禁用')
}
