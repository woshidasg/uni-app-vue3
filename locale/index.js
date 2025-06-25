import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN.js';
import enUS from './en-US.js';
import { getCache, setCache } from '@/utils/cache.js';

// 获取缓存的语言设置或使用系统语言
const getDefaultLanguage = () => {
  try {
    const cachedLanguage = getCache('language');
    if (cachedLanguage) return cachedLanguage;
    
    // 获取系统语言
    const systemInfo = uni.getSystemInfoSync();
    const systemLanguage = systemInfo.language || 'zh-CN';
    
    // 只支持中文和英文
    return systemLanguage.startsWith('zh') ? 'zh-CN' : 'en-US';
  } catch (e) {
    console.error('获取默认语言失败:', e);
    return 'zh-CN'; // 默认返回中文
  }
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  globalInjection: true, // 全局注入 $t 方法
  locale: getDefaultLanguage(),
  fallbackLocale: 'zh-CN',
  silentTranslationWarn: true, // 禁用翻译警告
  missingWarn: false, // 禁用缺失翻译警告
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
});

/**
 * 切换语言
 * @param {String} locale 语言代码
 */
export function setLanguage(locale) {
  if (!['zh-CN', 'en-US'].includes(locale)) {
    console.warn(`不支持的语言: ${locale}`);
    return;
  }
  
  try {
    const oldLocale = i18n.global.locale.value;
    i18n.global.locale.value = locale;
    setCache('language', locale);
    
    // 触发语言变更事件，以便其他组件可以响应
    if (oldLocale !== locale && typeof uni !== 'undefined') {
      console.log(`语言已从 ${oldLocale} 切换到 ${locale}`);
      uni.$emit('languageChanged', { oldLocale, newLocale: locale });
    }
  } catch (e) {
    console.error('设置语言失败:', e);
  }
}

/**
 * 获取当前语言
 * @returns {String} 语言代码
 */
export function getLanguage() {
  try {
    return i18n.global.locale.value;
  } catch (e) {
    console.error('获取语言失败:', e);
    return 'zh-CN';
  }
}

/**
 * 获取语言列表
 * @returns {Array} 语言列表
 */
export function getLanguageList() {
  return [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' }
  ];
}

export default i18n; 