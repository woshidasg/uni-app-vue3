/**
 * Modal 工具模块
 * 封装统一的消息提示、弹窗、loading 等方法
 */

export default {
  /**
   * 普通消息提示
   * @param {string} content - 提示内容
   * @param {number} duration - 显示时长（毫秒）
   */
  msg(content, duration = 2000) {
    uni.showToast({
      title: content,
      icon: 'none',
      duration
    })
  },

  /**
   * 成功消息提示
   * @param {string} content - 提示内容
   * @param {number} duration - 显示时长（毫秒）
   */
  msgSuccess(content, duration = 2000) {
    uni.showToast({
      title: content,
      icon: 'success',
      duration
    })
  },

  /**
   * 错误消息提示
   * @param {string} content - 提示内容
   * @param {number} duration - 显示时长（毫秒）
   */
  msgError(content, duration = 2000) {
    uni.showToast({
      title: content,
      icon: 'error',
      duration
    })
  },

  /**
   * 隐藏消息提示
   */
  hideMsg() {
    uni.hideToast()
  },

  /**
   * 警告弹窗
   * @param {string} content - 弹窗内容
   * @param {string} title - 弹窗标题
   * @returns {Promise<boolean>}
   */
  alert(content, title = '提示') {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        showCancel: false,
        success: () => resolve(true)
      })
    })
  },

  /**
   * 确认弹窗
   * @param {string} content - 弹窗内容
   * @param {string} title - 弹窗标题
   * @returns {Promise<boolean>}
   */
  confirm(content, title = '确认') {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title,
        content,
        cancelText: '取消',
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            resolve(true)
          } else {
            reject(false)
          }
        }
      })
    })
  },

  /**
   * 显示加载中
   * @param {string} title - 加载提示文本
   * @param {boolean} mask - 是否显示透明蒙层，防止触摸穿透
   */
  loading(title = '加载中...', mask = true) {
    uni.showLoading({
      title,
      mask
    })
  },

  /**
   * 关闭加载中
   */
  closeLoading() {
    try {
      uni.hideLoading()
    } catch (e) {
      console.error('关闭 loading 失败:', e)
    }
  },

  /**
   * 显示操作菜单
   * @param {Array<string>} itemList - 按钮的文字数组
   * @returns {Promise<number>} 用户点击的按钮索引
   */
  showActionSheet(itemList) {
    return new Promise((resolve, reject) => {
      uni.showActionSheet({
        itemList,
        success: (res) => {
          resolve(res.tapIndex)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}
