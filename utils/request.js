/**
 * 网络请求工具类
 */
import store from '@/store';
import { BASE_URL } from '@/common/config.js';

const request = (options) => {
	return new Promise((resolve, reject) => {
		// 请求拦截
		uni.showLoading({
			title: '加载中...'
		});

		const header = {
			...options.header
		};

		// 统一注入token
		if (store.state.user.token) {
			header['Authorization'] = `Bearer ${store.state.user.token}`;
		}

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: (res) => {
				// 响应拦截
				if (res.statusCode === 200) {
					// 请求成功
					resolve(res.data);
				} else if (res.statusCode === 401) {
					// token失效或未登录
					uni.showToast({
						title: '登录已失效，请重新登录',
						icon: 'none',
						duration: 2000
					});
					store.commit('user/LOGOUT');
					// 重定向到登录页
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 2000);
					reject(res);
				} else {
					// 其他错误
					uni.showToast({
						title: res.data.message || '请求失败',
						icon: 'none'
					});
					reject(res);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络错误，请稍后再试',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	});
};

/**
 * GET 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求参数
 * @param {object} options - 其他请求选项
 */
request.get = (url, data, options = {}) => {
	return request({ url, data, method: 'GET', ...options });
};

/**
 * POST 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求参数
 * @param {object} options - 其他请求选项
 */
request.post = (url, data, options = {}) => {
	return request({ url, data, method: 'POST', ...options });
};

/**
 * PUT 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求参数
 * @param {object} options - 其他请求选项
 */
request.put = (url, data, options = {}) => {
	return request({ url, data, method: 'PUT', ...options });
};

/**
 * DELETE 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求参数
 * @param {object} options - 其他请求选项
 */
request.delete = (url, data, options = {}) => {
	return request({ url, data, method: 'DELETE', ...options });
};

export default request; 