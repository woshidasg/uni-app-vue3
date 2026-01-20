/**
 * 用户相关 API
 */
import request from '@/utils/request';

/**
 * 生成随机头像URL
 */
function getRandomAvatar() {
  const avatarApis = [
    // UI Avatars - 基于用户名生成
    `https://ui-avatars.com/api/?name=User&size=200&background=random&color=fff&bold=true`,
    // DiceBear Avatars - 多种风格
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
    `https://api.dicebear.com/7.x/personas/svg?seed=${Math.random()}`,
    // Adorable Avatars
    `https://api.adorable.io/avatars/200/${Math.random()}.png`,
    // RoboHash
    `https://robohash.org/${Math.random()}?size=200x200`,
    // Pravatar - 真实人物头像
    `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`
  ];
  
  return avatarApis[Math.floor(Math.random() * avatarApis.length)];
}

/**
 * 真实登录接口 - 使用 POST 请求
 * @param {object} data - 登录数据
 * @returns {Promise}
 */
export function login(data) {
  return request.post('/auth/login', data);
}

/**
 * 模拟登录接口
 * @param {object} data - 登录数据 { username, password }
 */
export function mockLogin(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: 'mock-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: data.username || 'TestUser',
          name: '测试用户',
          avatar: getRandomAvatar()
        },
        menus: [
          { id: 1, name: '首页', path: '/pages/index/index', type: 'MENU', regType: 'NO' },
          { id: 2, name: '我的', path: '/pages/my/my', type: 'MENU', regType: 'NO' },
          { id: 3, name: '我的子页面', path: '/sub-pages/my/my', type: 'MENU', regType: 'YES' }
        ],
        permissions: ['user:view', 'user:edit']
      });
    }, 500);
  });
}
