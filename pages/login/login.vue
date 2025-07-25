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
				<uni-easyinput prefixIcon="person" type="text" v-model="formData.username" :placeholder="$t('login.enterUsername')" />
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput prefixIcon="locked" type="password" v-model="formData.password" :placeholder="$t('login.enterPassword')" />
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

		<button class="login-btn" :disabled="!isAgree" :class="{ 'disabled': !isAgree }" @click="handleLogin">{{ $t('login.loginButton') }}</button>
		
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
		// 动态设置页面标题 (虽然这是自定义导航栏，但仍设置以保持一致性)
		try {
			if (this.$t) {
				uni.setNavigationBarTitle({
					title: this.$t('login.title')
				});
			} else if (uni.$i18n) {
				uni.setNavigationBarTitle({
					title: uni.$i18n.global.t('login.title')
				});
			}
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
				
				mockLogin(this.formData).then(res => {
					this.login({
						token: res.data.token,
						userInfo: res.data.userInfo
					});
					uni.hideLoading();
					uni.showToast({ title: this.$t('login.loginSuccess'), icon: 'none' });
					setTimeout(() => {
						uni.switchTab({ url: '/pages/index/index' });
					}, 1500);

				}).catch(err => {
					uni.hideLoading();
				});

			}).catch(err => {
				console.log('表单错误信息：', err);
			})
		}
	}
}
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}

.login-container {
	padding: 30px 60px;
	display: flex;
	flex-direction: column;
}

.custom-nav-bar {
	height: 88px; // Approximation of navigation bar height
	display: flex;
	align-items: center;
	margin-bottom: 40px;
}

.logo-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 100px;
}

.logo {
	width: 180px;
	height: 180px;
	border-radius: 20px;
}

.app-name {
	font-size: 40px;
	font-weight: bold;
	margin-top: 20px;
	color: #333;
}

.form-section {
	margin-bottom: 20px;
}

.login-btn {
	background: linear-gradient(to right, #4a8cff, #2979ff);
	color: #ffffff;
	border-radius: 50px;
	font-size: 32px;
	box-shadow: 0 4px 10px rgba(41, 121, 255, 0.4);
	margin-top: 40px;
	height: 90px;
	line-height: 90px;
	width: 100%;

	&.disabled {
		background: #d8d8d8;
		box-shadow: none;
		color: #fff;
	}
}

.agreement-section {
	margin-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.agreement-text {
	font-size: 24px;
	color: #999;
}

.extra-links {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 40px;
	font-size: 26px;
	color: #999;
}

.link-divider {
	margin: 0 20px;
	color: #ccc;
}

.third-party-section {
	margin-top: 80px;
}

.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 30px;
}

.divider-text {
	color: #999;
	font-size: 24px;
	padding: 0 20px;
	position: relative;
}

.divider-text::before,
.divider-text::after {
	content: '';
	position: absolute;
	top: 50%;
	width: 80px;
	height: 1px;
	background-color: #e0e0e0;
}

.divider-text::before {
	left: -90px;
}

.divider-text::after {
	right: -90px;
}

.third-party-item {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}
</style> 