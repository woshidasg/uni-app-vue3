<template>
	<view class="container">
		<!-- Hero Section -->
		<view class="hero">
			<image class="hero-image" src="/static/logo.png" mode="aspectFit"></image>
			<text class="hero-title">{{ $t('index.title') }}</text>
			<text class="hero-subtitle">{{ $t('index.subtitle') }}</text>
		</view>

		<!-- User Welcome Card -->
		<view class="welcome-card" v-if="token">
			<view class="welcome-content">
				<view class="welcome-avatar">
					<image :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill"></image>
				</view>
				<view class="welcome-info">
					<text class="welcome-name">{{ $t('common.greeting') }}, {{ userInfo.name || userInfo.username }}</text>
					<text class="welcome-desc">{{ $t('common.welcome') }}</text>
				</view>
			</view>
		</view>

		<!-- Features Grid -->
		<uni-section :title="$t('index.coreFeatures')" type="line" padding>
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
				<uni-list-item 
					:title="$t('common.language') + ': ' + (currentLanguage === 'zh-CN' ? $t('common.chinese') : $t('common.english'))" 
					:note="$t('index.switchLanguage')" 
					showArrow 
					clickable 
					@tap="switchLanguage" 
				/>
				<uni-list-item 
					:title="$t('index.cacheManager')" 
					:note="$t('index.cacheDescription')" 
					showArrow 
					clickable 
					@tap="showCacheInfo" 
				/>
			</uni-list>
		</uni-section>

	</view>
</template>

<script>
import { mapState } from 'vuex';
import { setLanguage, getLanguage } from '@/locale';
	
export default {
	data() {
		return {
			currentLanguage: getLanguage()
		}
	},
	computed: {
		...mapState('user', ['token', 'userInfo'])
	},
	onLoad() {
		this.currentLanguage = getLanguage();
	},
	onShow() {
		try {
			uni.setNavigationBarTitle({
				title: this.$t('tabs.home')
			});
		} catch (e) {
			console.error('设置标题失败:', e);
		}
	},
	methods: {
		switchLanguage() {
			try {
				const newLang = this.currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN';
				setLanguage(newLang);
				this.currentLanguage = newLang;
				
				const toastTitle = newLang === 'zh-CN' 
					? this.$t('index.switchedToChinese')
					: this.$t('index.switchedToEnglish');
				
				uni.showToast({
					title: toastTitle,
					icon: 'none',
					duration: 2000
				});
				
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

<style lang="scss" scoped>
.container {
	background: linear-gradient(180deg, #f8f9fe 0%, #f5f5f5 100%);
	min-height: 100vh;
}

.hero {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 40px 20px 50px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
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

.hero-image {
	width: 100px;
	height: 100px;
	margin-bottom: 20px;
	border-radius: 50%;
	border: 4px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	position: relative;
	z-index: 1;
	animation: float 3s ease-in-out infinite;
}

@keyframes float {
	0%, 100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-10px);
	}
}

.hero-title {
	font-size: 28px;
	font-weight: bold;
	max-width: 90%;
	line-height: 1.3;
	margin: 0 auto;
	position: relative;
	z-index: 1;
	letter-spacing: 0.5px;
}

.hero-subtitle {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.95);
	margin-top: 12px;
	max-width: 95%;
	line-height: 1.6;
	margin-left: auto;
	margin-right: auto;
	position: relative;
	z-index: 1;
}

.welcome-card {
	margin: -25px 15px 20px;
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fe 100%);
	border-radius: 16px;
	padding: 20px;
	box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
	border: 1px solid rgba(102, 126, 234, 0.1);
	position: relative;
	z-index: 2;
}

.welcome-content {
	display: flex;
	align-items: center;
}

.welcome-avatar {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	overflow: hidden;
	border: 3px solid #667eea;
	margin-right: 15px;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	
	image {
		width: 100%;
		height: 100%;
	}
}

.welcome-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.welcome-name {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	margin-bottom: 6px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.welcome-desc {
	font-size: 13px;
	color: #666;
}

.grid-item-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px 10px;
	transition: all 0.3s ease;
	border-radius: 12px;
	
	&:active {
		background-color: #f8f9fe;
		transform: scale(0.95);
	}
}

.grid-text {
	font-size: 13px;
	margin-top: 10px;
	color: #555;
	text-align: center;
	padding: 0 5px;
	line-height: 1.5;
	font-weight: 500;
}

.collapse-content {
	padding: 20px;
	font-size: 14px;
	color: #666;
	line-height: 1.8;
	background: linear-gradient(135deg, #fafbff 0%, #f8f9fe 100%);
	border-left: 3px solid #667eea;
}

::v-deep .uni-section {
	margin-bottom: 15px;
	
	.uni-section__content {
		background-color: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	}
}

::v-deep .uni-list {
	background-color: #ffffff;
	border-radius: 16px;
	overflow: hidden;
	
	.uni-list-item {
		transition: background-color 0.2s ease;
		
		&:active {
			background-color: #f8f9fe;
		}
	}
}
</style>
