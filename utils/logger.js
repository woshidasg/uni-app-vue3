/**
 * 日志管理工具（增强版）
 * 支持日志级别、日志持久化、日志上报
 */

// 日志级别
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
}

// 日志级别名称映射
const LOG_LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
  4: 'FATAL'
}

// 日志颜色（H5 环境）
const LOG_COLORS = {
  DEBUG: '#909399',
  INFO: '#409EFF',
  WARN: '#E6A23C',
  ERROR: '#F56C6C',
  FATAL: '#C00000'
}

class Logger {
  constructor() {
    // 当前日志级别（生产环境只输出 WARN 及以上）
    // #ifdef DEVELOPMENT
    this.level = LOG_LEVELS.DEBUG
    // #endif
    
    // #ifdef PRODUCTION
    this.level = LOG_LEVELS.WARN
    // #endif
    
    this.maxLogs = 100 // 最多保存日志数
    this.logs = [] // 日志缓存
    this.enablePersist = false // 是否持久化
    this.enableReport = false // 是否上报
  }

  /**
   * 设置日志级别
   * @param {String} level - DEBUG, INFO, WARN, ERROR, FATAL
   */
  setLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      this.level = LOG_LEVELS[level]
      console.log(`[Logger] 日志级别已设置为: ${level}`)
    }
  }

  /**
   * 启用日志持久化
   */
  enablePersistence() {
    this.enablePersist = true
    this.loadLogs()
  }

  /**
   * 启用日志上报
   */
  enableReporting() {
    this.enableReport = true
  }

  /**
   * 格式化日志消息
   * @param {String} level - 日志级别
   * @param {String} tag - 标签
   * @param {Array} messages - 消息
   */
  formatMessage(level, tag, messages) {
    const timestamp = new Date().toLocaleString('zh-CN', { hour12: false })
    const levelName = LOG_LEVEL_NAMES[level]
    
    return {
      timestamp,
      level: levelName,
      tag,
      messages,
      fullMessage: `[${timestamp}] [${levelName}] [${tag}] ${messages.join(' ')}`
    }
  }

  /**
   * 输出日志
   * @param {Number} level - 日志级别
   * @param {String} tag - 标签
   * @param {Array} messages - 消息
   */
  log(level, tag, ...messages) {
    // 级别过滤
    if (level < this.level) return

    const logData = this.formatMessage(level, tag, messages)
    
    // 控制台输出
    this.consoleLog(level, logData)
    
    // 缓存日志
    this.cacheLogs(logData)
    
    // 持久化
    if (this.enablePersist) {
      this.persistLogs()
    }
    
    // 上报（仅 ERROR 和 FATAL）
    if (this.enableReport && level >= LOG_LEVELS.ERROR) {
      this.reportLog(logData)
    }
  }

  /**
   * 控制台输出
   * @param {Number} level - 日志级别
   * @param {Object} logData - 日志数据
   */
  consoleLog(level, logData) {
    const levelName = LOG_LEVEL_NAMES[level]
    
    // #ifdef H5
    const color = LOG_COLORS[levelName]
    console.log(
      `%c${logData.fullMessage}`,
      `color: ${color}; font-weight: bold;`
    )
    // #endif
    
    // #ifndef H5
    switch (level) {
      case LOG_LEVELS.DEBUG:
      case LOG_LEVELS.INFO:
        console.log(logData.fullMessage)
        break
      case LOG_LEVELS.WARN:
        console.warn(logData.fullMessage)
        break
      case LOG_LEVELS.ERROR:
      case LOG_LEVELS.FATAL:
        console.error(logData.fullMessage)
        break
    }
    // #endif
  }

  /**
   * 缓存日志
   * @param {Object} logData - 日志数据
   */
  cacheLogs(logData) {
    this.logs.push(logData)
    
    // 超过最大数量，删除最早的日志
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  /**
   * 持久化日志
   */
  persistLogs() {
    try {
      uni.setStorageSync('app_logs', JSON.stringify(this.logs))
    } catch (e) {
      console.error('[Logger] 日志持久化失败:', e)
    }
  }

  /**
   * 加载持久化日志
   */
  loadLogs() {
    try {
      const logs = uni.getStorageSync('app_logs')
      if (logs) {
        this.logs = JSON.parse(logs)
      }
    } catch (e) {
      console.error('[Logger] 加载日志失败:', e)
    }
  }

  /**
   * 上报日志到服务器
   * @param {Object} logData - 日志数据
   */
  reportLog(logData) {
    // TODO: 实现日志上报逻辑
    // uni.request({
    //   url: 'https://your-api.com/logs',
    //   method: 'POST',
    //   data: logData
    // })
    console.log('[Logger] 日志上报:', logData)
  }

  /**
   * 获取所有日志
   * @returns {Array}
   */
  getLogs() {
    return this.logs
  }

  /**
   * 清空日志
   */
  clearLogs() {
    this.logs = []
    if (this.enablePersist) {
      uni.removeStorageSync('app_logs')
    }
    console.log('[Logger] 日志已清空')
  }

  /**
   * 导出日志（用于调试）
   * @returns {String}
   */
  exportLogs() {
    return this.logs.map(log => log.fullMessage).join('\n')
  }

  // 便捷方法
  debug(tag, ...messages) {
    this.log(LOG_LEVELS.DEBUG, tag, ...messages)
  }

  info(tag, ...messages) {
    this.log(LOG_LEVELS.INFO, tag, ...messages)
  }

  warn(tag, ...messages) {
    this.log(LOG_LEVELS.WARN, ...messages)
  }

  error(tag, ...messages) {
    this.log(LOG_LEVELS.ERROR, tag, ...messages)
  }

  fatal(tag, ...messages) {
    this.log(LOG_LEVELS.FATAL, tag, ...messages)
  }
}

// 创建单例
const logger = new Logger()

export default logger
