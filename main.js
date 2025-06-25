import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import store from './store'
import setupPermission from './utils/permission.js'
import i18n from './locale'
import './utils/i18n-helper' // 引入 i18n 辅助函数

// 设置 vue-i18n 的功能标志，解决 esm-bundler 警告
// 这些应该在打包配置中设置，但这里作为临时解决方案
window.__VUE_I18N_FULL_INSTALLATION__ = true;
window.__VUE_I18N_LEGACY_API__ = true;
window.__INTLIFY_PROD_DEVTOOLS__ = false;

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(i18n)
  
  // 将i18n实例挂载到uni全局对象
  uni.$i18n = i18n;
  
  // 全局混入 $t 方法，确保所有组件都可以访问
  app.mixin({
    methods: {
      $t(key, values) {
        return i18n.global.t(key, values);
      }
    }
  });
  
  // 启用导航守卫
  setupPermission()

  // #ifdef DEVELOPMENT
  // 配置全局错误处理器
  app.config.errorHandler = (err, vm, info) => {
    console.error('全局错误捕获:', err, vm, info);
    uni.showModal({
      title: '组件渲染错误',
      content: `错误信息：${err.toString()}`,
      showCancel: false
    });
  }
  // #endif
  
  return {
    app,
    i18n  // 导出 i18n 实例，确保它可以被正确使用
  }
}
// #endif