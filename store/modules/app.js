/**
 * 应用模块 - 管理环境配置
 * 参考 himms-mobile 的环境管理方式
 */
import { DEFAULT_ENV_KEY, DEFAULT_ALL_ENV } from '@/common/config';

// 清除旧的缓存配置，确保使用最新的默认配置
try {
  uni.removeStorageSync('envKey');
  uni.removeStorageSync('allEnv');
  console.log('已清除旧的环境缓存配置');
} catch (e) {
  console.error('清除缓存失败:', e);
}

// 强制使用最新的默认配置，忽略缓存
const state = {
  // 当前环境 key - 始终使用默认值
  envKey: DEFAULT_ENV_KEY,
  // 所有环境配置 - 始终使用默认值
  allEnv: DEFAULT_ALL_ENV
};

const getters = {
  // 当前环境配置
  currentEnvConfig(state) {
    return state.allEnv[state.envKey];
  },
  // 当前环境的 baseUrl
  baseUrl(state, getters) {
    return getters.currentEnvConfig.baseUrl;
  },
  // 当前环境名称
  currentEnvName(state, getters) {
    return getters.currentEnvConfig.name;
  }
};

const mutations = {
  // 设置环境 key
  SET_ENV_KEY(state, envKey) {
    state.envKey = envKey;
    uni.setStorageSync('envKey', envKey);
  },
  // 设置所有环境配置
  SET_ALL_ENV(state, allEnv) {
    state.allEnv = allEnv;
    uni.setStorageSync('allEnv', allEnv);
  }
};

const actions = {
  // 切换环境
  switchEnv({ commit }, envKey) {
    const state = this.state.app
    if (!state.allEnv[envKey]) {
      console.error(`环境 ${envKey} 不存在`);
      return false;
    }

    commit('SET_ENV_KEY', envKey);
    
    uni.showModal({
      title: '提示',
      content: `已切换到${state.allEnv[envKey].name}，需要重启应用生效`,
      showCancel: false,
      success: () => {
        // 重启应用
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    });

    return true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
