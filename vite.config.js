import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { PROXY_CONFIG } from './common/config.js';

export default defineConfig({
  plugins: [uni()],
  server: {
    // 使用配置文件中的代理配置
    proxy: PROXY_CONFIG.dev
  },
  define: {
    // 解决 vue-i18n 警告
    __VUE_I18N_FULL_INSTALLATION__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false
  }
});
