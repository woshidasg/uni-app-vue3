/**
 * 缓存管理工具
 */
import { STORAGE_PREFIX, CACHE_TIME } from '@/common/config.js';
import { getSubpackageName } from './subpackage.js';

/**
 * 缓存数据结构
 * {
 *   data: 实际数据,
 *   expire: 过期时间戳,
 *   packageName: 所属分包名称（可选）
 * }
 */

/**
 * 设置缓存
 * @param {String} key 缓存键名
 * @param {*} data 缓存数据
 * @param {Object} options 配置项
 * @param {Number} options.expire 过期时间（秒）
 * @param {String} options.packageName 所属分包名称
 */
export function setCache(key, data, options = {}) {
  const { expire = CACHE_TIME.NORMAL, packageName = null } = options;
  
  const cache = {
    data,
    expire: expire > 0 ? Date.now() + expire * 1000 : 0,
    packageName
  };
  
  try {
    uni.setStorageSync(`${STORAGE_PREFIX}${key}`, JSON.stringify(cache));
  } catch (e) {
    console.error('缓存设置失败:', e);
  }
}

/**
 * 获取缓存
 * @param {String} key 缓存键名
 * @returns {*} 缓存数据，过期或不存在则返回null
 */
export function getCache(key) {
  try {
    const value = uni.getStorageSync(`${STORAGE_PREFIX}${key}`);
    if (!value) return null;
    
    const cache = JSON.parse(value);
    
    // 检查是否过期
    if (cache.expire > 0 && cache.expire < Date.now()) {
      removeCache(key);
      return null;
    }
    
    return cache.data;
  } catch (e) {
    console.error('获取缓存失败:', e);
    return null;
  }
}

/**
 * 删除缓存
 * @param {String} key 缓存键名
 */
export function removeCache(key) {
  try {
    uni.removeStorageSync(`${STORAGE_PREFIX}${key}`);
  } catch (e) {
    console.error('删除缓存失败:', e);
  }
}

/**
 * 清除所有缓存或指定分包的缓存
 * @param {String} packageName 分包名称，不传则清除所有
 */
export function clearCache(packageName = null) {
  if (!packageName) {
    try {
      // 保存当前的token和userInfo，以便后续处理
      const token = uni.getStorageSync(`${STORAGE_PREFIX}token`);
      const userInfo = uni.getStorageSync(`${STORAGE_PREFIX}userInfo`);
      
      // 清除所有缓存
      uni.clearStorageSync();
      
      // 如果清除了登录信息，需要重新登录
      if (token) {
        // 通知Vuex清除用户状态
        const store = require('@/store').default;
        store.dispatch('user/logout');
        
        // 跳转到登录页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }, 100);
      }
    } catch (e) {
      console.error('清除所有缓存失败:', e);
    }
    return;
  }
  
  // 清除指定分包的缓存
  try {
    const keys = uni.getStorageInfoSync().keys;
    keys.forEach(key => {
      if (!key.startsWith(STORAGE_PREFIX)) return;
      
      try {
        const value = uni.getStorageSync(key);
        if (!value) return;
        
        const cache = JSON.parse(value);
        if (cache.packageName === packageName) {
          uni.removeStorageSync(key);
        }
      } catch (e) {
        // 忽略单个缓存处理错误
      }
    });
  } catch (e) {
    console.error(`清除分包 ${packageName} 缓存失败:`, e);
  }
}

/**
 * 缓存分包资源
 * @param {String} url 资源URL
 * @param {*} data 资源数据
 * @param {Number} expire 过期时间（秒）
 */
export function cacheSubpackageResource(url, data, expire = CACHE_TIME.NORMAL) {
  const packageName = getSubpackageName(url);
  if (!packageName) {
    // 不属于分包资源，使用普通缓存
    setCache(`resource_${url}`, data, { expire });
    return;
  }
  
  // 缓存分包资源
  setCache(`resource_${url}`, data, { 
    expire,
    packageName 
  });
}

/**
 * 获取分包资源缓存
 * @param {String} url 资源URL
 * @returns {*} 缓存的资源数据
 */
export function getSubpackageResourceCache(url) {
  return getCache(`resource_${url}`);
}

/**
 * 清除分包资源缓存
 * @param {String} packageName 分包名称
 */
export function clearSubpackageResourceCache(packageName) {
  clearCache(packageName);
} 