import store from '@/store';
import { LOGIN_REQUIRED_PAGES } from '@/common/config.js';

// 定义路由白名单，这些页面不需要登录即可访问
const whiteList = [
	'/pages/index/index',
	'/pages/login/login'
];

/**
 * 检查用户是否有权限访问目标页面
 * @param {string} url - 目标页面的路径
 * @returns {boolean} - 返回 true 表示放行，false 表示拦截
 */
function hasPermission(url) {
	// 提取纯路径，去除参数
	const path = url.split('?')[0];
	const hasToken = store.state.user.token;

	if (hasToken) {
		// 如果已登录，但想访问登录页，则重定向到首页，防止重复登录
		if (path === '/pages/login/login') {
			uni.switchTab({
				url: '/pages/index/index'
			});
			return false;
		}
		return true; // 已登录，放行
	} else {
		// 未登录
		// 检查目标页是否在白名单中
		if (whiteList.some(item => path === item)) {
			return true; // 在白名单中，放行
		}

		// 检查目标页是否需要登录
		if (LOGIN_REQUIRED_PAGES.some(item => path === item)) {
			console.log('需要登录，跳转到登录页');
			uni.navigateTo({
				url: '/pages/login/login'
			});
			return false; // 需要登录但未登录，拦截并跳转登录页
		}
		
		// 默认情况下，如果页面既不在白名单也不在需要登录的列表，则允许访问
		// 您可以根据您的安全策略调整此处的默认行为
		return true;
	}
}

/**
 * 设置全局导航守卫
 */
export default function setupPermission() {
	const methods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
	methods.forEach(method => {
		uni.addInterceptor(method, {
			invoke(args) {
				console.log(`拦截到${method}导航:`, args.url);
				if (!hasPermission(args.url)) {
					return false; // 拦截跳转
				}
				return true; // 放行
			},
			fail(err) {
				console.error(`导航守卫[${method}]拦截失败:`, err);
			}
		});
	});
} 