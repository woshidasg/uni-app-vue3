/**
 * 应用全局状态模块
 */
const state = {
  theme: uni.getStorageSync('theme') || 'light',
  language: uni.getStorageSync('language') || 'zh-CN',
  systemInfo: {}
};

const mutations = {
  SET_THEME(state, theme) {
    state.theme = theme;
    uni.setStorageSync('theme', theme);
  },
  SET_LANGUAGE(state, language) {
    state.language = language;
    uni.setStorageSync('language', language);
  },
  SET_SYSTEM_INFO(state, systemInfo) {
    state.systemInfo = systemInfo;
  }
};

const actions = {
  // 初始化应用
  initApp({ commit }) {
    return new Promise((resolve) => {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync();
      commit('SET_SYSTEM_INFO', systemInfo);
      resolve(systemInfo);
    });
  },
  
  // 切换主题
  toggleTheme({ commit, state }) {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    commit('SET_THEME', newTheme);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}; 