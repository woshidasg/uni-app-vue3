import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [
    uni()
  ],
  define: {
    // 解决 vue-i18n 警告
    __VUE_I18N_FULL_INSTALLATION__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  // 如果您使用的是 HBuilderX 而不是 CLI 方式，这个配置可能不会生效
  // 在这种情况下，请使用 main.js 中的全局变量方式
}); 