/**
 * 网络请求工具类（优化版）
 * 从 store 动态获取 baseUrl，支持环境切换
 */
import store from '@/store';
import { REQUEST_TIMEOUT } from '@/common/config.js';
import { getErrorMessage, shouldReload } from './error-code';
import { ref } from 'vue';

// 请求计数器（智能 loading 管理）
const requestCount = ref(0);

/**
 * 显示 loading
 * @param {string} title - loading 文本
 */
function showLoading(title = '加载中...') {
	requestCount.value++;
	if (requestCount.value === 1) {
		uni.showLoading({
			title,
			mask: true
		});
	}
}

/**
 * 隐藏 loading
 */
function hideLoading() {
	requestCount.value--;
	if (requestCount.value <= 0) {
		requestCount.value = 0;
		try {
			uni.hideLoading();
		} catch (e) {
			console.error('隐藏 loading 失败:', e);
		}
	}
}

/**
 * 处理请求成功
 */
function handleSuccess(res, isReturnOriginalData, resolve, reject) {
	const code = res.data?.code || res.statusCode || 200;
	const msg = res.data?.msg || res.data?.message || getErrorMessage(code);

	// 需要重新登录
	if (shouldReload(code)) {
		uni.showModal({
			title: '提示',
			content: msg || '登录状态已过期，请重新登录',
			showCancel: false,
			success: () => {
				store.commit('user/LOGOUT');
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		});
		reject({ code, msg });
		return;
	}

	// 请求成功
	if (code === 200 || res.statusCode === 200) {
		if (isReturnOriginalData) {
			resolve(res.data);
		} else {
			resolve(res.data?.data || res.data);
		}
	} else {
		// 业务错误
		uni.showToast({
			title: msg,
			icon: 'none'
		});
		reject({ code, msg });
	}
}

/**
 * 处理请求失败
 */
function handleFail(err, reject) {
	let errMsg = err.errMsg || '网络请求失败';

	if (errMsg === 'request:fail') {
		errMsg = '网络连接失败，请检查网络';
	} else if (errMsg.includes('timeout')) {
		errMsg = '请求超时，请稍后重试';
	} else if (errMsg.includes('abort')) {
		errMsg = '请求已取消';
	}

	uni.showToast({
		title: errMsg,
		icon: 'none'
	});

	reject({ errMsg, error: err });
}

const request = (options) => {
	const {
		url,
		method = 'GET',
		data = {},
		header = {},
		timeout = REQUEST_TIMEOUT,
		showLoading: shouldShowLoading = true,
		loadingText = '加载中...',
		isReturnOriginalData = false,
		isToken = true
	} = options;

	return new Promise((resolve, reject) => {
		// 显示 loading
		if (shouldShowLoading) {
			showLoading(loadingText);
		}

		// 构建请求头
		const requestHeader = { ...header };
		if (isToken && store.state.user.token) {
			requestHeader['Authorization'] = `Bearer ${store.state.user.token}`;
		}

		// 从 store 动态获取 baseUrl
		const baseUrl = store.getters['app/baseUrl'];

		// 发起请求
		uni.request({
			url: baseUrl + url,
			method,
			data,
			header: requestHeader,
			timeout,
			success: (res) => {
				handleSuccess(res, isReturnOriginalData, resolve, reject);
			},
			fail: (err) => {
				handleFail(err, reject);
			},
			complete: () => {
				if (shouldShowLoading) {
					hideLoading();
				}
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

/**
 * 上传文件
 * @param {string} url - 上传地址
 * @param {string} filePath - 要上传文件资源的路径
 * @param {object} formData - HTTP 请求中其他额外的 form data
 * @param {object} options - 其他配置项
 */
request.upload = (url, filePath, formData = {}, options = {}) => {
	const {
		name = 'file',
		header = {},
		showLoading: shouldShowLoading = true,
		loadingText = '上传中...'
	} = options;

	return new Promise((resolve, reject) => {
		if (shouldShowLoading) {
			showLoading(loadingText);
		}

		const requestHeader = { ...header };
		if (store.state.user.token) {
			requestHeader['Authorization'] = `Bearer ${store.state.user.token}`;
		}

		// 从 store 动态获取 baseUrl
		const baseUrl = store.getters['app/baseUrl'];

		uni.uploadFile({
			url: baseUrl + url,
			filePath,
			name,
			formData,
			header: requestHeader,
			success: (res) => {
				try {
					const data = JSON.parse(res.data);
					if (data.code === 200) {
						resolve(data.data);
					} else {
						uni.showToast({
							title: data.msg || '上传失败',
							icon: 'none'
						});
						reject(data);
					}
				} catch (e) {
					reject({ errMsg: '解析响应数据失败', error: e });
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				if (shouldShowLoading) {
					hideLoading();
				}
			}
		});
	});
};

export default request; 