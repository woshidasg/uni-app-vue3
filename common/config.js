/**
 * 全局配置文件（统一配置）
 * 包含：API配置、代理配置、环境配置、路由配置等
 */

// ========== API 配置 ==========
// 统一使用代理路径作为前端网关前缀，由代理转发到后端 /api
export const BASE_URL = '/uni-app-api'; // API基础URL（代理路径）
export const REQUEST_TIMEOUT = 30000; // 请求超时时间(毫秒)

// ========== 环境配置 ==========
/**
 * 默认环境
 */
export const DEFAULT_ENV_KEY = 'dev';

/**
 * 所有环境配置
 * 说明：
 * - H5 环境：使用代理路径（如 /uni-app-api），由 Vite 代理转发到后端
 * - 小程序/App 环境：使用完整 URL（如 http://192.168.1.105:19999/api）
 */
export const DEFAULT_ALL_ENV = {
  dev: {
    name: '开发环境',
    // H5 使用代理路径
    baseUrl: BASE_URL,
    // 小程序/App 使用完整 URL（如果需要支持小程序，取消下面的注释）
    // baseUrl: 'http://localhost:19999/api',
    debug: true
  },
  test: {
    name: '测试环境',
    baseUrl: 'https://test-api.example.com/api',
    debug: true
  },
  prod: {
    name: '生产环境',
    baseUrl: 'https://api.example.com/api',
    debug: false
  }
};

// ========== 路由配置 ==========
const NO_TOKEN_BACK_URL = '/pages/login/login';
const HAS_TOKEN_BACK_URL = '/pages/index/index';

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

// ========== 代理配置 ==========
/**
 * @name 代理的配置
 * @description 在生产环境代理是无法生效的，需要使用 Nginx 等反向代理
 */
export const PROXY_CONFIG = {
  // 开发环境代理配置
  dev: {
    '/uni-app-api/': {
      // 要代理的后端地址
      target: 'http://127.0.0.1:19999',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      // 路径重写：/uni-app-api/auth/login -> /api/auth/login
      rewrite: (path) => path.replace(/^\/uni-app-api/, '/api'),
    }
  },
  // 测试环境代理配置
  test: {
    '/uni-app-api/': {
      target: 'https://test-api.example.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/uni-app-api/, '/api'),
    }
  },
  // 生产环境（使用 Nginx 反向代理，此配置不生效）
  prod: {
    '/uni-app-api/': {
      target: 'https://api.example.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/uni-app-api/, '/api'),
    }
  }
};

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
