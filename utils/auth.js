/**
 * 认证相关工具函数（优化版）
 */

import store from '@/store';
import config from '@/common/config';

// Token 存储键名
const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';

/**
 * 获取token
 */
export function getToken() {
  return uni.getStorageSync(TOKEN_KEY);
}

/**
 * 设置token
 * @param {String} token
 */
export function setToken(token) {
  return uni.setStorageSync(TOKEN_KEY, token);
}

/**
 * 移除token
 */
export function removeToken() {
  return uni.removeStorageSync(TOKEN_KEY);
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return uni.getStorageSync(USER_INFO_KEY) || {};
}

/**
 * 设置用户信息
 * @param {Object} userInfo
 */
export function setUserInfo(userInfo) {
  return uni.setStorageSync(USER_INFO_KEY, userInfo);
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  return uni.removeStorageSync(USER_INFO_KEY);
}

/**
 * 清除所有认证信息
 */
export function clearAuth() {
  removeToken();
  removeUserInfo();
}

/**
 * 检查是否已登录
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * 检查页面访问权限（核心方法）
 * @param {string} path - 页面路径
 * @returns {boolean} - 是否允许访问
 */
export function checkPermission(path) {
  const hasToken = !!getToken();

  // 场景1: 未登录
  if (!hasToken) {
    return handleNoToken(path);
  }

  // 场景2: 已登录
  return handleHasToken(path);
}

/**
 * 处理未登录场景
 * @param {string} path - 页面路径
 * @returns {boolean}
 */
function handleNoToken(path) {
  const { NO_TOKEN_WHITE_LIST, NO_TOKEN_BACK_URL } = config;

  // 在白名单中，允许访问
  if (NO_TOKEN_WHITE_LIST.includes(path)) {
    return true;
  }

  // 不在白名单，提示并跳转登录页
  uni.showToast({
    title: '请先登录',
    icon: 'none',
    duration: 1500
  });

  setTimeout(() => {
    // #ifdef H5
    const redirectUrl = addRedirectParam(NO_TOKEN_BACK_URL, path);
    uni.reLaunch({ url: redirectUrl });
    // #endif

    // #ifndef H5
    uni.reLaunch({ url: NO_TOKEN_BACK_URL });
    // #endif
  }, 1500);

  return false;
}

/**
 * 处理已登录场景
 * @param {string} path - 页面路径
 * @returns {boolean}
 */
function handleHasToken(path) {
  const { NO_TOKEN_BACK_URL, HAS_TOKEN_BACK_URL, NO_TOKEN_WHITE_LIST, HAS_TOKEN_WHITE_LIST } = config;

  // 访问登录页，跳转首页
  if (path === NO_TOKEN_BACK_URL || path === '/') {
    uni.reLaunch({ url: HAS_TOKEN_BACK_URL });
    return false;
  }

  // 在白名单中，允许访问
  if (NO_TOKEN_WHITE_LIST.includes(path) || HAS_TOKEN_WHITE_LIST.includes(path)) {
    return true;
  }

  // 检查菜单权限
  return checkMenuPermission(path);
}

/**
 * 检查菜单权限
 * @param {string} path - 页面路径
 * @returns {boolean}
 */
function checkMenuPermission(path) {
  const menus = store.state.user.menus || [];

  // 如果没有菜单数据，默认允许访问（可根据实际需求调整）
  if (menus.length === 0) {
    return true;
  }

  // 查找匹配的菜单
  const hasPermission = menus.some(menu => {
    if (menu.type !== 'MENU') return false;

    // 精确匹配
    if (menu.regType === 'NO' || !menu.regType) {
      return menu.path === path;
    }

    // 正则匹配（同文件夹下）
    if (menu.regType === 'YES') {
      const folderPath = menu.path.substring(0, menu.path.lastIndexOf('/') + 1);
      return path.startsWith(folderPath);
    }

    return false;
  });

  if (!hasPermission) {
    uni.showToast({
      title: '没有访问权限',
      icon: 'none',
      duration: 1500
    });

    setTimeout(() => {
      uni.reLaunch({ url: config.HAS_TOKEN_BACK_URL });
    }, 1500);
  }

  return hasPermission;
}

/**
 * 为登录页添加重定向参数（H5 专用）
 * @param {string} loginUrl - 登录页路径
 * @param {string} redirectUrl - 重定向路径
 * @returns {string}
 */
function addRedirectParam(loginUrl, redirectUrl) {
  // 排除特殊路径
  if (!redirectUrl || redirectUrl === '/' || redirectUrl === loginUrl) {
    return loginUrl;
  }

  // 已有 redirect 参数
  if (loginUrl.includes('redirect=')) {
    return loginUrl;
  }

  // 添加 redirect 参数
  const separator = loginUrl.includes('?') ? '&' : '?';
  return `${loginUrl}${separator}redirect=${encodeURIComponent(redirectUrl)}`;
}

/**
 * 登录成功后跳转（在登录页调用）
 */
export function redirectAfterLogin() {
  // #ifdef H5
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');

    if (redirect) {
      uni.reLaunch({ url: decodeURIComponent(redirect) });
      return;
    }
  } catch (e) {
    console.error('解析重定向参数失败:', e);
  }
  // #endif

  // 默认跳转首页
  uni.reLaunch({ url: config.HAS_TOKEN_BACK_URL });
} 