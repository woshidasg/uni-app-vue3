<template>
	<view class="container">
		<!-- Hero Section -->
		<view class="hero">
			<image class="hero-image" src="/static/logo.png" mode="aspectFit"></image>
			<text class="hero-title">{{ $t ? $t('index.title') : 'uni-app 项目模板' }}</text>
			<text class="hero-subtitle">{{ $t ? $t('index.subtitle') : '一个高效、规范、功能完备的 uni-app 开发脚手架，支持分包加载、多语言国际化和代码规范' }}</text>
		</view>

		<!-- Features Grid -->
		<uni-section :title="$t ? $t('index.coreFeatures') : '核心功能'" type="line" padding>
			<uni-grid :column="3" :show-border="false" :square="false">
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="paperplane-filled" size="30" color="#2979ff"></uni-icons>
						<text class="grid-text">{{ $t('index.requestPackage') }}</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="fire-filled" size="30" color="#dd524d"></uni-icons>
						<text class="grid-text">{{ $t('index.stateManagement') }}</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="locked-filled" size="30" color="#f0ad4e"></uni-icons>
						<text class="grid-text">{{ $t('index.routeGuard') }}</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="download-filled" size="30" color="#8dc63f"></uni-icons>
						<text class="grid-text">{{ $t('index.subpackageLoading') }}</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="chat-filled" size="30" color="#9c27b0"></uni-icons>
						<text class="grid-text">{{ $t('index.multilingual') }}</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="checkmarkempty" size="30" color="#009688"></uni-icons>
						<text class="grid-text">{{ $t('index.codeStandards') }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</uni-section>

		<!-- Component Showcase -->
		<uni-section :title="$t('index.featureShowcase')" type="line" padding>
			<uni-collapse accordion>
				<uni-collapse-item :title="$t('index.networkRequest')">
					<view class="collapse-content">
						<text>{{ $t('index.networkRequestDesc') }}</text>
					</view>
				</uni-collapse-item>
				<uni-collapse-item :title="$t('index.stateManagement')">
					<view class="collapse-content">
						<text>{{ $t('index.stateManagementDesc') }}</text>
					</view>
				</uni-collapse-item>
				<uni-collapse-item :title="$t('index.routeGuard')">
					<view class="collapse-content">
						<text>{{ $t('index.routeGuardDesc') }}</text>
					</view>
				</uni-collapse-item>
				<uni-collapse-item :title="$t('index.subpackageLoading')">
					<view class="collapse-content">
						<text>{{ $t('index.subpackageLoadingDesc') }}</text>
					</view>
				</uni-collapse-item>
				<uni-collapse-item :title="$t('index.multilingual')">
					<view class="collapse-content">
						<text>{{ $t('index.multilingualDesc') }}</text>
					</view>
				</uni-collapse-item>
				<uni-collapse-item :title="$t('index.codeStandards')">
					<view class="collapse-content">
						<text>{{ $t('index.codeStandardsDesc') }}</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</uni-section>

		<!-- Additional Features -->
		<uni-section :title="$t('index.extendedFeatures')" type="line" padding>
			<uni-list>
				<uni-list-item :title="$t('common.language') + ': ' + (currentLanguage === 'zh-CN' ? $t('common.chinese') : $t('common.english'))" :note="$t('index.switchLanguage')" showArrow clickable @tap="switchLanguage" />
				<uni-list-item :title="$t('index.cacheManager')" :note="$t('index.cacheDescription')" showArrow clickable @tap="showCacheInfo" />
			</uni-list>
		</uni-section>

	</view>
</template>

<script>
	import { setLanguage, getLanguage, getLanguageList } from '@/locale';
	
	export default {
		data() {
			return {
				title: 'App-Template',
				currentLanguage: getLanguage()
			}
		},
		onLoad() {
			// 页面加载时更新当前语言
			this.currentLanguage = getLanguage();
		},
		onShow() {
			// 动态设置页面标题
			try {
				if (this.$t) {
					uni.setNavigationBarTitle({
						title: this.$t('tabs.home')
					});
				} else if (uni.$i18n) {
					uni.setNavigationBarTitle({
						title: uni.$i18n.global.t('tabs.home')
					});
				}
			} catch (e) {
				console.error('设置标题失败:', e);
			}
		},
		methods: {
			switchLanguage() {
				try {
					// 切换语言
					const newLang = this.currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN';
					console.log('切换语言:', this.currentLanguage, '->', newLang);
					
					// 设置语言
					setLanguage(newLang);
					
					// 更新当前语言
					this.currentLanguage = newLang;
					
					// 显示提示
					const toastTitle = newLang === 'zh-CN' 
						? (this.$t ? this.$t('index.switchedToChinese') : '已切换到中文')
						: (this.$t ? this.$t('index.switchedToEnglish') : 'Switched to English');
					
					uni.showToast({
						title: toastTitle,
						icon: 'none',
						duration: 2000
					});
					
					// 刷新当前页面
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 500);
				} catch (e) {
					console.error('切换语言失败:', e);
					uni.showToast({
						title: '切换语言失败',
						icon: 'none'
					});
				}
			},
			showCacheInfo() {
				uni.showModal({
					title: this.$t('index.cacheManagerTitle'),
					content: this.$t('index.cacheManagerContent'),
					showCancel: false
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.hero {
		background: linear-gradient(to bottom, #4a8cff, #2979ff);
		color: white;
		padding: 80rpx 40rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.hero-image {
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 20rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
	}
	
	.hero-title {
		font-size: 48rpx;
		font-weight: bold;
		max-width: 90%;
		line-height: 1.3;
		margin: 0 auto;
	}
	
	.hero-subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-top: 10rpx;
		max-width: 95%;
		line-height: 1.4;
		margin-left: auto;
		margin-right: auto;
	}

	.grid-item-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
	}
	
	.grid-text {
		font-size: 26rpx;
		margin-top: 10rpx;
		color: #666;
		text-align: center;
		padding: 0 5rpx;
		line-height: 1.3;
		height: 2.6em;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.collapse-content {
		padding: 15px;
		font-size: 14px;
		color: #666;
		line-height: 22px;
		background-color: #fdfdfd;
	}
</style>
