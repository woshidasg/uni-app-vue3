/**
 * Tab 路由工具模块
 * 封装统一的页面跳转方法
 */

export default {
  /**
   * 保留当前页面，跳转到应用内的某个页面
   * @param {string} url - 需要跳转的应用内非 tabBar 的页面的路径
   * @param {object} options - 其他配置项
   * @returns {Promise}
   */
  navigateTo(url, options = {}) {
    return uni.navigateTo({
      url,
      ...options
    })
  },

  /**
   * 关闭当前页面，跳转到应用内的某个页面
   * @param {string} url - 需要跳转的应用内非 tabBar 的页面的路径
   * @param {object} options - 其他配置项
   * @returns {Promise}
   */
  redirectTo(url, options = {}) {
    return uni.redirectTo({
      url,
      ...options
    })
  },

  /**
   * 关闭所有页面，打开到应用内的某个页面
   * @param {string} url - 需要跳转的应用内页面路径
   * @param {object} options - 其他配置项
   * @returns {Promise}
   */
  reLaunch(url, options = {}) {
    return uni.reLaunch({
      url,
      ...options
    })
  },

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   * @param {string} url - 需要跳转的 tabBar 页面的路径
   * @param {object} options - 其他配置项
   * @returns {Promise}
   */
  switchTab(url, options = {}) {
    return uni.switchTab({
      url,
      ...options
    })
  },

  /**
   * 关闭当前页面，返回上一页面或多级页面
   * @param {number} delta - 返回的页面数，如果 delta 大于现有页面数，则返回到首页
   * @returns {Promise}
   */
  navigateBack(delta = 1) {
    return uni.navigateBack({
      delta
    })
  },

  /**
   * 预加载页面
   * @param {string} url - 预加载页面url
   * @returns {Promise}
   */
  preloadPage(url) {
    // #ifdef APP-PLUS
    return uni.preloadPage({
      url
    })
    // #endif
    // #ifndef APP-PLUS
    return Promise.resolve()
    // #endif
  },

  /**
   * 关闭预加载页面
   * @param {string} url - 预加载页面url
   */
  unPreloadPage(url) {
    // #ifdef APP-PLUS
    uni.unPreloadPage({
      url
    })
    // #endif
  }
}
