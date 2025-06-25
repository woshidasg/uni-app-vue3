import request from '@/utils/request';

// 模拟登录接口
export function mockLogin(data) {
	// 注意：这里我们不直接调用request，因为登录本身是不需要token的
	// 这是一个模拟实现，实际项目中你应该调用真实的登录接口
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				code: 200,
				message: '成功',
				data: {
					token: 'a-mock-token-from-server',
					userInfo: {
						name: 'TestUser',
						avatar: 'https://via.placeholder.com/150'
					}
				}
			});
		}, 500);
	});
}
