<template>
	<view class="my-container">
		<!-- 用户信息区域 -->
		<view class="user-profile" @click="editProfile">
			<view class="user-avatar">
				<image class="avatar-image" src="/static/logo.png"></image>
			</view>
			<view class="user-info">
				<text class="username">{{ userInfo.name || $t('my.pleaseLogin') }}</text>
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
				<uni-list-item :title="$t('my.myOrders')" showArrow clickable>
					<template v-slot:header>
						<uni-icons type="shop-filled" size="22" class="menu-icon"></uni-icons>
					</template>
				</uni-list-item>
				<uni-list-item :title="$t('my.addressManagement')" showArrow clickable>
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
				<uni-list-item :title="$t('my.feedback')" showArrow clickable @click="goToFeedback">
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

		<!-- 退出登录 -->
		<view class="logout-section" v-if="token">
			<button class="logout-btn" @click="handleLogout">{{ $t('my.logout') }}</button>
		</view>

		<!-- 关于弹窗 -->
		<uni-popup ref="aboutDialog" type="dialog">
			<uni-popup-dialog type="info" :cancelText="$t('my.close')" :confirmText="$t('my.ok')" :title="$t('my.aboutTitle')"
				:content="$t('my.aboutContent')" @confirm="closeAboutDialog"></uni-popup-dialog>
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
		// 动态设置页面标题
		try {
			if (this.$t) {
				uni.setNavigationBarTitle({
					title: this.$t('tabs.my')
				});
			} else if (uni.$i18n) {
				uni.setNavigationBarTitle({
					title: uni.$i18n.global.t('tabs.my')
				});
			}
		} catch (e) {
			console.error('设置标题失败:', e);
		}
	},
	methods: {
		...mapActions('user', ['logout']),
		goToGithub() {
			uni.setClipboardData({
				data: 'https://github.com/woshidasg',
				success: () => {
					uni.showToast({
						title: this.$t('my.githubCopied'),
						icon: 'none'
					});
				}
			});
		},
		handleLogout() {
			this.logout();
			uni.showToast({
				title: this.$t('my.logoutSuccess'),
				icon: 'none'
			});
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}, 1500);
		},
		editProfile() {
			uni.showToast({
				title: this.$t('my.editProfileHint'),
				icon: 'none'
			});
		},
		showAboutDialog() {
			this.$refs.aboutDialog.open();
		},
		closeAboutDialog() {
			this.$refs.aboutDialog.close();
		},
		goToFeedback() {
			// 跳转到分包内的页面, 如果您还未创建分包, 此处会报错
			uni.navigateTo({
				url: '/packages/help/feedback'
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
							icon: 'none'
						});
					}
				}
			});
		}
	}
}
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
}

.my-container {
	padding-bottom: 20px;
}

.user-profile {
	display: flex;
	align-items: center;
	padding: 40rpx;
	background: linear-gradient(to right, #4a8cff, #2979ff);
	color: white;
	position: relative;
}

.profile-arrow {
	position: absolute;
	right: 40rpx;
	top: 50%;
	transform: translateY(-50%);
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.5);
	overflow: hidden;
	margin-right: 30rpx;
}

.avatar-image {
	width: 100%;
	height: 100%;
}

.user-info {
	display: flex;
	flex-direction: column;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
}

.edit-hint {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-top: 8rpx;
}

.stats-section {
	margin: -20rpx 20rpx 20rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	padding: 20rpx 0;
	position: relative;
	box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.grid-item-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.stats-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-top: 8rpx;
}

.stats-label {
	font-size: 24rpx;
	color: #666;
	margin-top: 8rpx;
}

.menu-section {
	margin: 20rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	overflow: hidden;
}

.menu-icon {
	margin-right: 10px;
	color: #2979ff;
}

.logout-section {
	margin: 40rpx 20rpx;
}

.logout-btn {
	background-color: #dd524d;
	color: #ffffff;
}
</style> 