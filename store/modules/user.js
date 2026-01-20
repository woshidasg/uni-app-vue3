/**
 * 用户模块（优化版）
 */
const storedUserInfo = uni.getStorageSync('userInfo');
const state = {
  token: uni.getStorageSync('token') || '',
  userInfo: storedUserInfo 
    ? (typeof storedUserInfo === 'string' ? JSON.parse(storedUserInfo) : storedUserInfo)
    : {},
  menus: [], // 用户菜单权限
  permissions: [] // 用户按钮权限
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
  SET_MENUS(state, menus) {
    state.menus = menus;
    uni.setStorageSync('userMenus', JSON.stringify(menus));
  },
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions;
    uni.setStorageSync('userPermissions', JSON.stringify(permissions));
  },
  LOGOUT(state) {
    state.token = '';
    state.userInfo = {};
    state.menus = [];
    state.permissions = [];
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
    uni.removeStorageSync('userMenus');
    uni.removeStorageSync('userPermissions');
  }
};

const actions = {
  // 登录
  login({ commit }, { token, userInfo, menus = [], permissions = [] }) {
    commit('SET_TOKEN', token);
    commit('SET_USER_INFO', userInfo);
    commit('SET_MENUS', menus);
    commit('SET_PERMISSIONS', permissions);
  },
  
  // 登出
  logout({ commit }) {
    commit('LOGOUT');
  },

  // 获取用户信息（从服务器）
  async getUserInfo({ commit }) {
    // 这里应该调用实际的 API
    // const res = await request.get('/user/info');
    // commit('SET_USER_INFO', res.userInfo);
    // commit('SET_MENUS', res.menus);
    // commit('SET_PERMISSIONS', res.permissions);
    
    // 临时返回，避免 ESLint 警告
    return Promise.resolve(commit)
  }
};

const getters = {
  // 判断是否有某个权限
  hasPermission: (state) => (permission) => {
    return state.permissions.includes(permission);
  },

  // 判断是否有某个菜单
  hasMenu: (state) => (menuPath) => {
    return state.menus.some(menu => menu.path === menuPath);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 