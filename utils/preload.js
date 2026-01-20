/**
 * 资源预加载工具
 * 支持分包预加载、页面预加载、图片预加载
 */

class PreloadManager {
  constructor() {
    this.preloadedPages = new Set();
    this.preloadedSubpackages = new Set();
    this.preloadedImages = new Set();
    this.preloadQueue = [];
    this.isPreloading = false;
  }

  /**
   * 预加载分包
   * @param {string|Array} packageNames - 分包名称或名称数组
   * @param {Object} options - 配置选项
   */
  preloadSubpackage(packageNames, options = {}) {
    const {
      priority = 'normal', // high, normal, low
      networkType = 'all' // all, wifi, 4g
    } = options;

    const names = Array.isArray(packageNames) ? packageNames : [packageNames];

    // 检查网络类型
    if (networkType !== 'all') {
      uni.getNetworkType({
        success: (res) => {
          const currentType = res.networkType;
          if (networkType === 'wifi' && currentType !== 'wifi') {
            console.log('[Preload] Skip subpackage preload: not on WiFi');
            return;
          }
        }
      });
    }

    names.forEach(name => {
      if (this.preloadedSubpackages.has(name)) {
        console.log(`[Preload] Subpackage ${name} already preloaded`);
        return;
      }

      const task = {
        type: 'subpackage',
        name,
        priority,
        execute: () => this._executeSubpackagePreload(name)
      };

      this.addToQueue(task);
    });

    this.processQueue();
  }

  /**
   * 执行分包预加载
   * @param {string} name - 分包名称
   */
  _executeSubpackagePreload(name) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU
      uni.preloadSubpackage({
        name: name,
        success: () => {
          this.preloadedSubpackages.add(name);
          console.log(`[Preload] Subpackage ${name} preloaded successfully`);
          resolve();
        },
        fail: (err) => {
          console.error(`[Preload] Subpackage ${name} preload failed:`, err);
          reject(err);
        }
      });
      // #endif

      // #ifndef MP-WEIXIN || MP-ALIPAY || MP-BAIDU
      // H5 和 App 不支持分包预加载
      console.log(`[Preload] Subpackage preload not supported on this platform`);
      resolve();
      // #endif
    });
  }

  /**
   * 预加载页面
   * @param {string} url - 页面路径
   * @param {Object} options - 配置选项
   */
  preloadPage(url, options = {}) {
    const {
      priority = 'normal'
    } = options;

    if (this.preloadedPages.has(url)) {
      console.log(`[Preload] Page ${url} already preloaded`);
      return;
    }

    const task = {
      type: 'page',
      url,
      priority,
      execute: () => this._executePagePreload(url)
    };

    this.addToQueue(task);
    this.processQueue();
  }

  /**
   * 执行页面预加载
   * @param {string} url - 页面路径
   */
  _executePagePreload(url) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.preloadPage({
        url: url,
        success: () => {
          this.preloadedPages.add(url);
          console.log(`[Preload] Page ${url} preloaded successfully`);
          resolve();
        },
        fail: (err) => {
          console.error(`[Preload] Page ${url} preload failed:`, err);
          reject(err);
        }
      });
      // #endif

      // #ifndef MP-WEIXIN
      // 其他平台不支持页面预加载
      console.log(`[Preload] Page preload not supported on this platform`);
      resolve();
      // #endif
    });
  }

  /**
   * 预加载图片
   * @param {string|Array} urls - 图片URL或URL数组
   * @param {Object} options - 配置选项
   */
  preloadImages(urls, options = {}) {
    const {
      priority = 'low',
      networkType = 'wifi' // 默认只在WiFi下预加载图片
    } = options;

    const urlList = Array.isArray(urls) ? urls : [urls];

    // 检查网络类型
    if (networkType !== 'all') {
      uni.getNetworkType({
        success: (res) => {
          const currentType = res.networkType;
          if (networkType === 'wifi' && currentType !== 'wifi') {
            console.log('[Preload] Skip image preload: not on WiFi');
            return;
          }
          
          this._addImagePreloadTasks(urlList, priority);
        }
      });
    } else {
      this._addImagePreloadTasks(urlList, priority);
    }
  }

  /**
   * 添加图片预加载任务
   * @param {Array} urls - 图片URL数组
   * @param {string} priority - 优先级
   */
  _addImagePreloadTasks(urls, priority) {
    urls.forEach(url => {
      if (this.preloadedImages.has(url)) {
        return;
      }

      const task = {
        type: 'image',
        url,
        priority,
        execute: () => this._executeImagePreload(url)
      };

      this.addToQueue(task);
    });

    this.processQueue();
  }

  /**
   * 执行图片预加载
   * @param {string} url - 图片URL
   */
  _executeImagePreload(url) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: url,
        success: () => {
          this.preloadedImages.add(url);
          console.log(`[Preload] Image ${url} preloaded successfully`);
          resolve();
        },
        fail: (err) => {
          console.error(`[Preload] Image ${url} preload failed:`, err);
          reject(err);
        }
      });
    });
  }

  /**
   * 添加任务到队列
   * @param {Object} task - 任务对象
   */
  addToQueue(task) {
    // 根据优先级插入队列
    const priorityMap = { high: 0, normal: 1, low: 2 };
    const taskPriority = priorityMap[task.priority] || 1;

    let insertIndex = this.preloadQueue.length;
    for (let i = 0; i < this.preloadQueue.length; i++) {
      const queuePriority = priorityMap[this.preloadQueue[i].priority] || 1;
      if (taskPriority < queuePriority) {
        insertIndex = i;
        break;
      }
    }

    this.preloadQueue.splice(insertIndex, 0, task);
  }

  /**
   * 处理预加载队列
   */
  async processQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const task = this.preloadQueue.shift();
      
      try {
        await task.execute();
      } catch (err) {
        console.error('[Preload] Task execution failed:', err);
      }

      // 添加延迟，避免阻塞主线程
      await this.delay(100);
    }

    this.isPreloading = false;
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 空闲时预加载
   * @param {Function} callback - 预加载回调
   */
  preloadOnIdle(callback) {
    // #ifdef H5
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        callback();
      }, { timeout: 2000 });
    } else {
      setTimeout(callback, 1000);
    }
    // #endif

    // #ifndef H5
    setTimeout(callback, 1000);
    // #endif
  }

  /**
   * 清除预加载缓存
   */
  clearCache() {
    this.preloadedPages.clear();
    this.preloadedSubpackages.clear();
    this.preloadedImages.clear();
    this.preloadQueue = [];
    console.log('[Preload] Cache cleared');
  }

  /**
   * 获取预加载统计
   */
  getStats() {
    return {
      preloadedPages: this.preloadedPages.size,
      preloadedSubpackages: this.preloadedSubpackages.size,
      preloadedImages: this.preloadedImages.size,
      queueLength: this.preloadQueue.length
    };
  }
}

// 创建单例
const preloadManager = new PreloadManager();

export default preloadManager;
