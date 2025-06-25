<script>
	import { getLanguage } from '@/locale';
	
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// 初始化时设置tabBar文本
			this.setTabBarText();
			
			// 监听语言变化事件
			uni.$on('languageChanged', () => {
				console.log('语言已更改，更新 TabBar 文本');
				this.setTabBarText();
			});
		},
		onShow: function() {
			console.log('App Show');
			// 每次显示时更新tabBar文本
			this.setTabBarText();
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			setTabBarText() {
				// 动态设置tabBar文本
				const i18n = uni.$i18n;
				if (!i18n) {
					console.warn('i18n 实例不可用，无法设置 TabBar 文本');
					return;
				}
				
				// 获取当前页面路径
				const pages = getCurrentPages();
				if (pages.length === 0) return;
				
				const currentPage = pages[pages.length - 1];
				const route = currentPage.route || '';
				
				// 只在 TabBar 页面设置 TabBar 文本
				if (route === 'pages/index/index' || route === 'sub-pages/my/my') {
					try {
						console.log('设置 TabBar 文本');
						
						uni.setTabBarItem({
							index: 0,
							text: i18n.global.t('tabs.home')
						});
						
						uni.setTabBarItem({
							index: 1,
							text: i18n.global.t('tabs.my')
						});
					} catch (e) {
						console.error('设置 TabBar 文本失败:', e);
					}
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
