/**
 * 用户模块
 */
const storedUserInfo = uni.getStorageSync('userInfo');
const state = {
  token: uni.getStorageSync('token') || '',
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : {}
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    uni.setStorageSync('token', token);
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
    uni.setStorageSync('userInfo', JSON.stringify(userInfo));
  },
  LOGOUT(state) {
    state.token = '';
    state.userInfo = {};
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
  }
};

const actions = {
  // 登录
  login({ commit }, { token, userInfo }) {
    commit('SET_TOKEN', token);
    commit('SET_USER_INFO', userInfo);
  },
  
  // 登出
  logout({ commit }) {
    commit('LOGOUT');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}; 