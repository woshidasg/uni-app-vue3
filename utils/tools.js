/**
 * 通用工具函数
 */

/**
 * 日期格式化
 * @param {Date|String|Number} date 日期
 * @param {String} fmt 格式化模式 yyyy-MM-dd HH:mm:ss
 * @returns {String}
 */
export function formatDate(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
  date = date instanceof Date ? date : new Date(date);
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  
  return fmt;
}

/**
 * 深拷贝
 * @param {*} obj 要拷贝的对象
 * @returns {*}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const result = Array.isArray(obj) ? [] : {};
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  
  return result;
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 延迟时间，单位ms
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  
  return function(...args) {
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {Number} interval 间隔时间，单位ms
 * @returns {Function}
 */
export function throttle(fn, interval = 300) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 获取URL参数
 * @param {String} name 参数名
 * @param {String} url URL
 * @returns {String|null}
 */
export function getUrlParam(name, url = window.location.href) {
  const reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)', 'i');
  const matches = url.match(reg);
  
  return matches ? decodeURIComponent(matches[2]) : null;
} 