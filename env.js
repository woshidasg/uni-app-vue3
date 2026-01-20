/**
 * 环境配置文件
 * 参考 himms-mobile 的环境管理方式
 */

// 默认环境
const defaultEnvKey = 'local';

// 所有环境配置
const defaultAllEnv = {
  local: {
    name: '本地环境',
    baseUrl: 'http://localhost:3000',
    debug: true
  },
  dev: {
    name: '开发环境',
    baseUrl: 'http://192.168.1.105:8083/dcs',
    debug: true
  },
  test: {
    name: '测试环境',
    baseUrl: 'https://test-api.example.com',
    debug: true
  },
  prod: {
    name: '生产环境',
    baseUrl: 'https://api.example.com',
    debug: false
  }
};

// 导出配置
export default {
  DEFAULT_ENV_KEY: defaultEnvKey,
  DEFAULT_ALL_ENV: defaultAllEnv
};
