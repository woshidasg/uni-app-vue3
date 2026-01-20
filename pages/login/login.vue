<template>
	<view class="login-container">
		<!-- Custom Navigation Bar -->
		<view class="custom-nav-bar">
			<uni-icons type="left" size="24" @click="goBack"></uni-icons>
		</view>

		<view class="logo-area">
			<image class="logo" src="/static/logo.png"></image>
			<view class="app-name">{{ $t('login.appName') }}</view>
		</view>

		<uni-forms class="form-section" :modelValue="formData" :rules="rules" ref="form">
			<uni-forms-item name="username">
				<uni-easyinput 
					prefixIcon="person" 
					type="text" 
					v-model="formData.username" 
					:placeholder="$t('login.enterUsername')" 
				/>
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput 
					prefixIcon="locked" 
					type="password" 
					v-model="formData.password" 
					:placeholder="$t('login.enterPassword')" 
				/>
			</uni-forms-item>
		</uni-forms>

		<view class="agreement-section">
			<checkbox-group @change="agreementChange">
				<label>
					<checkbox value="agree" :checked="isAgree" style="transform:scale(0.7)" />
					<text class="agreement-text">{{ $t('login.agreement') }}</text>
				</label>
			</checkbox-group>
		</view>

		<button 
			class="login-btn" 
			:disabled="!isAgree" 
			:class="{ 'disabled': !isAgree }" 
			@click="handleLogin"
		>
			{{ $t('login.loginButton') }}
		</button>
		
		<view class="extra-links">
			<text class="link">{{ $t('login.registerAccount') }}</text>
			<text class="link-divider">|</text>
			<text class="link">{{ $t('login.forgotPassword') }}</text>
		</view>

		<view class="third-party-section">
			<view class="divider">
				<text class="divider-text">{{ $t('login.thirdPartyLogin') }}</text>
			</view>
			<uni-grid :column="3" :show-border="false" :square="true">
				<uni-grid-item>
					<view class="third-party-item">
						<uni-icons type="weixin" size="35" color="#42b983"></uni-icons>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="third-party-item">
						<uni-icons type="qq" size="35" color="#2979ff"></uni-icons>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="third-party-item">
						<uni-icons type="weibo" size="35" color="#dd524d"></uni-icons>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
import { mockLogin } from '@/api/user.js';

export default {
	data() {
		return {
			isAgree: false,
			formData: {
				username: '',
				password: ''
			},
			rules: {
				username: {
					rules: [{
						required: true,
						errorMessage: this.$t('login.usernameRequired'),
					}, {
						minLength: 3,
						maxLength: 12,
						errorMessage: this.$t('login.usernameLength', { minLength: 3, maxLength: 12 }),
					}]
				},
				password: {
					rules: [{
						required: true,
						errorMessage: this.$t('login.passwordRequired'),
					}]
				}
			}
		}
	},
	onShow() {
		try {
			uni.setNavigationBarTitle({
				title: this.$t('login.title')
			});
		} catch (e) {
			console.error('设置标题失败:', e);
		}
	},
	methods: {
		...mapActions('user', ['login']),
		goBack() {
			uni.navigateBack();
		},
		agreementChange(e) {
			this.isAgree = e.detail.value.length > 0;
		},
		handleLogin() {
			this.$refs.form.validate().then(res => {
				uni.showLoading({ title: this.$t('login.loginInProgress') });
				
				// 调用模拟登录接口
				mockLogin(this.formData).then(data => {
					// 调用 store 的 login action
					this.login({
						token: data.token,
						userInfo: data.userInfo,
						menus: data.menus || [],
						permissions: data.permissions || []
					});
					
					uni.hideLoading();
					uni.showToast({ 
						title: this.$t('login.loginSuccess'), 
						icon: 'success',
						duration: 1500
					});
					
					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({ url: '/pages/index/index' });
					}, 1500);

				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err.errMsg || '登录失败',
						icon: 'none'
					});
				});

			}).catch(err => {
				console.log('表单错误信息：', err);
			})
		}
	}
}
</script>

<style lang="scss" scoped>
page {
	background-color: #ffffff;
}

.login-container {
	padding: 15px 30px;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.custom-nav-bar {
	height: 44px;
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.logo-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 50px;
}

.logo {
	width: 90px;
	height: 90px;
	border-radius: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-name {
	font-size: 20px;
	font-weight: bold;
	margin-top: 15px;
	color: #333;
}

.form-section {
	margin-bottom: 10px;
}

.login-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	border-radius: 25px;
	font-size: 16px;
	box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
	margin-top: 20px;
	height: 45px;
	line-height: 45px;
	width: 100%;
	border: none;

	&.disabled {
		background: #d8d8d8;
		box-shadow: none;
		color: #fff;
	}
}

.agreement-section {
	margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.agreement-text {
	font-size: 12px;
	color: #999;
}

.extra-links {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
	font-size: 13px;
	color: #999;
}

.link {
	cursor: pointer;
	
	&:hover {
		color: #667eea;
	}
}

.link-divider {
	margin: 0 10px;
	color: #ccc;
}

.third-party-section {
	margin-top: 40px;
}

.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 15px;
}

.divider-text {
	color: #999;
	font-size: 12px;
	padding: 0 10px;
	position: relative;
}

.divider-text::before,
.divider-text::after {
	content: '';
	position: absolute;
	top: 50%;
	width: 40px;
	height: 1px;
	background-color: #e0e0e0;
}

.divider-text::before {
	left: -45px;
}

.divider-text::after {
	right: -45px;
}

.third-party-item {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 10px 0;
}
</style>
