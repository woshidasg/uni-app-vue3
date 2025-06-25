/**
 * 全局配置文件
 */

// 开发环境
const isDev = process.env.NODE_ENV === 'development';

// API基础路径
export const BASE_URL = isDev 
  ? 'http://localhost:3000/api' 
  : 'https://api.example.com/api';

// 应用信息
export const APP_INFO = {
  name: 'YJ应用',
  version: '1.0.0',
  description: 'uni-app YJ项目'
};

// 请求超时时间
export const REQUEST_TIMEOUT = 10000;

// 存储Key前缀
export const STORAGE_PREFIX = 'YJ_';

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

// 缓存时间（单位：秒）
export const CACHE_TIME = {
  SHORT: 60, // 1分钟
  NORMAL: 1800, // 30分钟
  LONG: 86400 // 1天
};

// 需要登录才能访问的页面路径列表
export const LOGIN_REQUIRED_PAGES = [
	'/pages/my/my',
	'/sub-pages/my/my'
]; 