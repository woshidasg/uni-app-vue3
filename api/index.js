/**
 * API请求封装
 */
import Request from '@/utils/request.js';
import { BASE_URL, REQUEST_TIMEOUT } from '@/common/config.js';

// 请求实例
const request = new Request({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT
});

export default request; 