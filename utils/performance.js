/**
 * 性能监控工具
 * 监控 FCP、LCP、TTP 等关键性能指标
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: 0, // First Contentful Paint
      lcp: 0, // Largest Contentful Paint
      ttp: 0, // Time to Interactive
      fps: 0, // Frames Per Second
      memory: 0, // 内存使用
      pageLoadTime: 0, // 页面加载时间
      apiResponseTime: {} // API 响应时间
    };
    
    this.observers = [];
    this.isMonitoring = false;
    this.fpsFrames = [];
    this.fpsLastTime = Date.now();
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // #ifdef H5
    this.initH5Performance();
    // #endif

    // 监控页面加载时间
    this.monitorPageLoad();
    
    // 监控 FPS
    this.monitorFPS();
    
    // 监控内存
    this.monitorMemory();
  }

  /**
   * H5 环境性能监控
   */
  initH5Performance() {
    // #ifdef H5
    if (!window.PerformanceObserver) return;

    try {
      // 监控 FCP
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            console.log(`[Performance] FCP: ${entry.startTime.toFixed(2)}ms`);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);

      // 监控 LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        console.log(`[Performance] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // 监控长任务
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`[Performance] Long Task: ${entry.duration.toFixed(2)}ms`);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.error('[Performance] Observer init failed:', e);
    }
    // #endif
  }

  /**
   * 监控页面加载时间
   */
  monitorPageLoad() {
    const startTime = Date.now();
    
    // 页面加载完成
    uni.$on('pageLoadComplete', () => {
      this.metrics.pageLoadTime = Date.now() - startTime;
      console.log(`[Performance] Page Load Time: ${this.metrics.pageLoadTime}ms`);
      
      // 计算 TTP (可交互时间)
      this.metrics.ttp = this.metrics.pageLoadTime;
      
      // 上报性能数据
      this.reportMetrics();
    });
  }

  /**
   * 监控 FPS
   */
  monitorFPS() {
    let frameCount = 0;
    let lastTime = Date.now();

    const countFrame = () => {
      frameCount++;
      const now = Date.now();
      
      if (now - lastTime >= 1000) {
        this.metrics.fps = frameCount;
        frameCount = 0;
        lastTime = now;
        
        // FPS 过低时警告
        if (this.metrics.fps < 30) {
          console.warn(`[Performance] Low FPS: ${this.metrics.fps}`);
        }
      }
      
      if (this.isMonitoring) {
        requestAnimationFrame(countFrame);
      }
    };

    requestAnimationFrame(countFrame);
  }

  /**
   * 监控内存使用
   */
  monitorMemory() {
    // #ifdef H5
    if (window.performance && window.performance.memory) {
      setInterval(() => {
        const memory = window.performance.memory;
        this.metrics.memory = {
          usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2), // MB
          totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2), // MB
          jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) // MB
        };
      }, 5000);
    }
    // #endif
  }

  /**
   * 记录 API 响应时间
   * @param {string} apiName - API 名称
   * @param {number} duration - 响应时间（ms）
   */
  recordApiTime(apiName, duration) {
    if (!this.metrics.apiResponseTime[apiName]) {
      this.metrics.apiResponseTime[apiName] = [];
    }
    
    this.metrics.apiResponseTime[apiName].push(duration);
    
    // 只保留最近 10 次记录
    if (this.metrics.apiResponseTime[apiName].length > 10) {
      this.metrics.apiResponseTime[apiName].shift();
    }
    
    // 响应时间过长时警告
    if (duration > 3000) {
      console.warn(`[Performance] Slow API: ${apiName} took ${duration}ms`);
    }
  }

  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: uni.getSystemInfoSync()
    };
  }

  /**
   * 上报性能数据
   */
  reportMetrics() {
    const metrics = this.getMetrics();
    
    // 开发环境打印
    // #ifdef DEVELOPMENT
    console.log('[Performance] Metrics:', metrics);
    // #endif
    
    // 生产环境上报到服务器
    // #ifdef PRODUCTION
    // TODO: 上报到性能监控服务器
    // uni.request({
    //   url: 'https://your-api.com/performance',
    //   method: 'POST',
    //   data: metrics
    // });
    // #endif
  }

  /**
   * 标记性能时间点
   * @param {string} name - 标记名称
   */
  mark(name) {
    // #ifdef H5
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
    // #endif
    
    console.log(`[Performance] Mark: ${name} at ${Date.now()}`);
  }

  /**
   * 测量两个标记之间的时间
   * @param {string} name - 测量名称
   * @param {string} startMark - 开始标记
   * @param {string} endMark - 结束标记
   */
  measure(name, startMark, endMark) {
    // #ifdef H5
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      } catch (e) {
        console.error('[Performance] Measure failed:', e);
      }
    }
    // #endif
    return 0;
  }

  /**
   * 停止监控
   */
  stop() {
    this.isMonitoring = false;
    
    // 断开所有观察器
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        console.error('[Performance] Observer disconnect failed:', e);
      }
    });
    
    this.observers = [];
  }

  /**
   * 获取性能评分
   * @returns {Object} 性能评分对象
   */
  getPerformanceScore() {
    const { fcp, lcp, ttp, fps } = this.metrics;
    
    const scores = {
      fcp: this.calculateScore(fcp, 1000, 1500, 3000),
      lcp: this.calculateScore(lcp, 2000, 2500, 4000),
      ttp: this.calculateScore(ttp, 2500, 3000, 5000),
      fps: fps >= 55 ? 100 : fps >= 30 ? 60 : 30
    };
    
    const totalScore = (scores.fcp + scores.lcp + scores.ttp + scores.fps) / 4;
    
    return {
      scores,
      totalScore: Math.round(totalScore),
      grade: this.getGrade(totalScore)
    };
  }

  /**
   * 计算单项评分
   * @param {number} value - 实际值
   * @param {number} good - 优秀阈值
   * @param {number} needsImprovement - 需要改进阈值
   * @param {number} poor - 差阈值
   */
  calculateScore(value, good, needsImprovement, poor) {
    if (value <= good) return 100;
    if (value <= needsImprovement) return 80;
    if (value <= poor) return 50;
    return 30;
  }

  /**
   * 获取性能等级
   * @param {number} score - 总分
   */
  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// 创建单例
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
