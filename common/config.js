/**
 * 全局配置文件（优化版）
 * 环境配置已移至 env.js 和 store/modules/app.js
 */

// ========== 路由配置 ==========
const NO_TOKEN_BACK_URL = '/pages/login/login';
const HAS_TOKEN_BACK_URL = '/pages/index/index';

// 请求超时时间
export const REQUEST_TIMEOUT = 10000;

// 存储Key前缀
export const STORAGE_PREFIX = 'YJ_';

// 应用信息
export const APP_INFO = {
  name: 'uni-app',
  version: '1.0.0',
  description: 'uni-app Vue3 项目'
};

// 缓存时间（单位：秒）
export const CACHE_TIME = {
  SHORT: 60,      // 1分钟
  NORMAL: 1800,   // 30分钟
  LONG: 86400     // 1天
};

// 主题配置
export const THEME_CONFIG = {
  light: {
    primaryColor: '#2979ff',
    backgroundColor: '#ffffff',
    textColor: '#333333'
  },
  dark: {
    primaryColor: '#1c6fe8',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff'
  }
};

// 需要登录才能访问的页面路径列表（兼容旧版）
export const LOGIN_REQUIRED_PAGES = [
  '/pages/my/my',
  '/sub-pages/my/my'
];

// ========== 默认导出（统一配置对象） ==========
export default {
  // ========== 基础配置 ==========
  APP_INFO,

  // ========== 服务配置 ==========
  // 服务类型：SINGLE（单体）/ MICRO（微服务）
  SERVER_TYPE: 'SINGLE',
  REQUEST_TIMEOUT,

  // ========== Token 配置 ==========
  TOKEN_KEY: 'token',
  TOKEN_PREFIX: 'Bearer ',

  // ========== 路由配置 ==========
  // 未登录跳转页面
  NO_TOKEN_BACK_URL,

  // 已登录跳转页面
  HAS_TOKEN_BACK_URL,

  // 不需要登录的页面白名单
  NO_TOKEN_WHITE_LIST: [
    NO_TOKEN_BACK_URL,
    '/',
    '/pages/index/index',
    '/pages/env-switch/env-switch' // 环境切换页面
  ],

  // 需要登录的页面白名单
  HAS_TOKEN_WHITE_LIST: [
    HAS_TOKEN_BACK_URL,
    '/pages/my/my',
    '/sub-pages/my/my'
  ],

  // ========== 存储配置 ==========
  STORAGE_PREFIX,

  // ========== 缓存时间配置 ==========
  CACHE_TIME,

  // ========== 主题配置 ==========
  THEME_CONFIG
};
