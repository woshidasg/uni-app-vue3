/**
 * 网络状态监控工具
 * 监控网络连接状态，提供离线/在线提示
 */

class NetworkMonitor {
  constructor() {
    this.isOnline = true
    this.networkType = 'unknown'
    this.listeners = []
    this.isMonitoring = false
  }

  /**
   * 初始化网络监控
   */
  init() {
    if (this.isMonitoring) return
    this.isMonitoring = true

    // 获取初始网络状态
    this.checkNetworkStatus()

    // 监听网络状态变化
    uni.onNetworkStatusChange((res) => {
      const wasOnline = this.isOnline
      this.isOnline = res.isConnected
      this.networkType = res.networkType

      console.log(`[Network] 网络状态变化: ${res.networkType}, 连接: ${res.isConnected}`)

      // 从离线变为在线
      if (!wasOnline && this.isOnline) {
        this.handleOnline()
      }

      // 从在线变为离线
      if (wasOnline && !this.isOnline) {
        this.handleOffline()
      }

      // 通知监听器
      this.notifyListeners({
        isOnline: this.isOnline,
        networkType: this.networkType
      })
    })

    console.log('✅ 网络监控已启动')
  }

  /**
   * 检查当前网络状态
   */
  checkNetworkStatus() {
    uni.getNetworkType({
      success: (res) => {
        this.networkType = res.networkType
        this.isOnline = res.networkType !== 'none'
        console.log(`[Network] 当前网络: ${res.networkType}`)
      }
    })
  }

  /**
   * 处理网络恢复
   */
  handleOnline() {
    uni.showToast({
      title: '网络已恢复',
      icon: 'success',
      duration: 2000
    })

    // 可以在这里触发数据重新加载
    uni.$emit('networkOnline')
  }

  /**
   * 处理网络断开
   */
  handleOffline() {
    uni.showToast({
      title: '网络已断开',
      icon: 'none',
      duration: 2000
    })

    uni.$emit('networkOffline')
  }

  /**
   * 添加网络状态监听器
   * @param {Function} callback - 回调函数
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback)
    }
  }

  /**
   * 移除网络状态监听器
   * @param {Function} callback - 回调函数
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * 通知所有监听器
   * @param {Object} status - 网络状态
   */
  notifyListeners(status) {
    this.listeners.forEach(callback => {
      try {
        callback(status)
      } catch (e) {
        console.error('[Network] 监听器执行失败:', e)
      }
    })
  }

  /**
   * 获取当前网络状态
   * @returns {Object}
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      networkType: this.networkType
    }
  }

  /**
   * 判断是否为 WiFi
   * @returns {Boolean}
   */
  isWiFi() {
    return this.networkType === 'wifi'
  }

  /**
   * 判断是否为移动网络
   * @returns {Boolean}
   */
  isMobile() {
    return ['2g', '3g', '4g', '5g'].includes(this.networkType)
  }

  /**
   * 停止监控
   */
  stop() {
    this.isMonitoring = false
    this.listeners = []
    console.log('❌ 网络监控已停止')
  }
}

// 创建单例
const networkMonitor = new NetworkMonitor()

export default networkMonitor
