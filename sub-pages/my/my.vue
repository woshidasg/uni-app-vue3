<template>
	<view class="my-container">
		<!-- 用户信息区域 -->
		<view class="user-profile" @click="editProfile">
			<view class="user-avatar">
				<image class="avatar-image" :src="userInfo.avatar || '/static/logo.png'"></image>
			</view>
			<view class="user-info">
				<text class="username">{{ token ? (userInfo.name || userInfo.username) : $t('my.pleaseLogin') }}</text>
				<text class="user-id" v-if="token && userInfo.id">ID: {{ userInfo.id }}</text>
				<text class="edit-hint">{{ $t('my.editHint') }}</text>
			</view>
			<view class="profile-arrow">
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
		</view>

		<!-- 数据统计 -->
		<view class="stats-section">
			<uni-grid :column="3" :show-border="false" :square="false">
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="star-filled" size="26" color="#f0ad4e"></uni-icons>
						<text class="stats-label">{{ $t('my.myCollections') }}</text>
						<text class="stats-value">12</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="staff-filled" size="26" color="#2979ff"></uni-icons>
						<text class="stats-label">{{ $t('my.myFollows') }}</text>
						<text class="stats-value">8</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="pyq" size="26" color="#42b983"></uni-icons>
						<text class="stats-label">{{ $t('my.myPosts') }}</text>
						<text class="stats-value">3</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>

		<!-- 功能列表 -->
		<view class="menu-section">
			<uni-list :border="false">
				<uni-list-item :title="$t('my.myOrders')" showArrow clickable @click="showComingSoon">
					<template v-slot:header>
						<uni-icons type="shop-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
				<uni-list-item :title="$t('my.addressManagement')" showArrow clickable @click="showComingSoon">
					<template v-slot:header>
						<uni-icons type="location-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		
		<view class="menu-section">
			<uni-list :border="false">
				<uni-list-item :title="$t('my.myGithub')" showArrow clickable @click="goToGithub">
					<template v-slot:header>
						<uni-icons type="github-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
				<uni-list-item :title="$t('my.feedback')" showArrow clickable @click="showComingSoon">
					<template v-slot:header>
						<uni-icons type="email-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		
		<view class="menu-section">
			<uni-list :border="false">
				<uni-list-item :title="$t('my.clearCache')" showArrow clickable @click="clearCache">
					<template v-slot:header>
						<uni-icons type="trash-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
				<uni-list-item :title="$t('my.aboutTemplate')" showArrow clickable @click="showAboutDialog">
					<template v-slot:header>
						<uni-icons type="info-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
			</uni-list>
		</view>

		<!-- 登录/退出按钮 -->
		<view class="action-section">
			<button v-if="!token" class="login-btn" @click="goToLogin">{{ $t('login.login') }}</button>
			<button v-else class="logout-btn" @click="handleLogout">{{ $t('my.logout') }}</button>
		</view>

		<!-- 关于弹窗 -->
		<uni-popup ref="aboutDialog" type="dialog">
			<uni-popup-dialog 
				type="info" 
				:cancelText="$t('my.close')" 
				:confirmText="$t('my.ok')" 
				:title="$t('my.aboutTitle')"
				:content="$t('my.aboutContent')" 
				@confirm="closeAboutDialog"
			></uni-popup-dialog>
		</uni-popup>

	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	computed: {
		...mapState('user', ['userInfo', 'token'])
	},
	onShow() {
		try {
			uni.setNavigationBarTitle({
				title: this.$t('tabs.my')
			});
		} catch (e) {
			console.error('设置标题失败:', e);
		}
	},
	methods: {
		...mapActions('user', ['logout']),
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		},
		goToGithub() {
			// #ifdef H5
			window.open('https://github.com/woshidasg', '_blank');
			// #endif
			
			// #ifdef MP || APP-PLUS
			uni.showModal({
				title: '提示',
				content: '是否要打开外部浏览器访问 GitHub？',
				success: (res) => {
					if (res.confirm) {
						// #ifdef APP-PLUS
						plus.runtime.openURL('https://github.com/woshidasg');
						// #endif
						
						// #ifdef MP
						uni.setClipboardData({
							data: 'https://github.com/woshidasg',
							success: () => {
								uni.showToast({
									title: this.$t('my.githubCopied'),
									icon: 'none'
								});
							}
						});
						// #endif
					}
				}
			});
			// #endif
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						this.logout();
						uni.showToast({
							title: this.$t('my.logoutSuccess'),
							icon: 'success',
							duration: 1500
						});
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1500);
					}
				}
			});
		},
		editProfile() {
			if (!this.token) {
				uni.showModal({
					title: '提示',
					content: this.$t('my.pleaseLogin'),
					confirmText: this.$t('login.login'),
					success: (res) => {
						if (res.confirm) {
							this.goToLogin();
						}
					}
				});
			} else {
				uni.showToast({
					title: this.$t('my.editProfileHint'),
					icon: 'none'
				});
			}
		},
		showAboutDialog() {
			this.$refs.aboutDialog.open();
		},
		closeAboutDialog() {
			this.$refs.aboutDialog.close();
		},
		showComingSoon() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none',
				duration: 2000
			});
		},
		clearCache() {
			uni.showModal({
				title: this.$t('my.clearCacheTitle'),
				content: this.$t('my.clearCacheContent'),
				success: (res) => {
					if (res.confirm) {
						uni.clearStorageSync();
						this.logout();
						uni.showToast({
							title: this.$t('my.cacheCleared'),
							icon: 'success'
						});
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}, 1500);
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
page {
	background: linear-gradient(180deg, #f8f9fe 0%, #f5f5f5 100%);
}

.my-container {
	padding-bottom: 20px;
	min-height: 100vh;
}

.user-profile {
	display: flex;
	align-items: center;
	padding: 30px 20px 40px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -20%;
		width: 300px;
		height: 300px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
	}
	
	&::after {
		content: '';
		position: absolute;
		bottom: -30%;
		left: -10%;
		width: 200px;
		height: 200px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 50%;
	}
}

.profile-arrow {
	position: absolute;
	right: 20px;
	top: 50%;
	transform: translateY(-50%);
	z-index: 1;
	opacity: 0.9;
}

.user-avatar {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	border: 3px solid rgba(255, 255, 255, 0.4);
	overflow: hidden;
	margin-right: 18px;
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	position: relative;
	z-index: 1;
	transition: transform 0.3s ease;
	
	&:active {
		transform: scale(0.95);
	}
}

.avatar-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.user-info {
	display: flex;
	flex-direction: column;
	flex: 1;
	position: relative;
	z-index: 1;
}

.username {
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 6px;
	letter-spacing: 0.5px;
}

.user-id {
	font-size: 13px;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 6px;
	font-family: 'Courier New', monospace;
}

.edit-hint {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.85);
	display: flex;
	align-items: center;
	
	&::before {
		content: '✏️';
		margin-right: 4px;
	}
}

.stats-section {
	margin: -20px 15px 15px;
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fe 100%);
	border-radius: 16px;
	padding: 15px 0;
	position: relative;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	border: 1px solid rgba(102, 126, 234, 0.1);
	z-index: 2;
}

.grid-item-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 10px;
	transition: all 0.3s ease;
	border-radius: 12px;
	
	&:active {
		background-color: #f8f9fe;
		transform: scale(0.95);
	}
}

.stats-value {
	font-size: 20px;
	font-weight: bold;
	color: #333;
	margin-top: 6px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.stats-label {
	font-size: 13px;
	color: #666;
	margin-top: 6px;
	font-weight: 500;
}

.menu-section {
	margin: 15px;
	background-color: #ffffff;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	border: 1px solid rgba(0, 0, 0, 0.04);
}

.menu-icon {
	margin-right: 8px;
	color: #667eea;
}

.action-section {
	margin: 25px 15px;
}

.login-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	border-radius: 28px;
	font-size: 17px;
	font-weight: 600;
	box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
	border: none;
	padding: 16px;
	letter-spacing: 1px;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
}

.logout-btn {
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
	color: #ffffff;
	border-radius: 24px;
	font-size: 15px;
	font-weight: 500;
	box-shadow: 0 4px 12px rgba(238, 90, 111, 0.3);
	border: none;
	padding: 12px;
	letter-spacing: 0.5px;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 2px 8px rgba(238, 90, 111, 0.2);
	}
}

::v-deep .uni-list {
	background-color: transparent;
	
	.uni-list-item {
		transition: background-color 0.2s ease;
		
		&:active {
			background-color: #f8f9fe;
		}
		
		&:not(:last-child) {
			border-bottom: 1px solid #f0f0f0;
		}
	}
}
</style>
