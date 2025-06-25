/**
 * i18n 辅助函数
 */
import i18n from '@/locale';

/**
 * 全局翻译函数
 * @param {String} key 翻译键
 * @param {Object} values 替换值
 * @returns {String} 翻译结果
 */
export function globalTranslate(key, values) {
  try {
    if (i18n && i18n.global && i18n.global.t) {
      return i18n.global.t(key, values);
    }
    
    // 如果 i18n 实例不可用，尝试从 uni.$i18n 获取
    if (uni && uni.$i18n && uni.$i18n.global && uni.$i18n.global.t) {
      return uni.$i18n.global.t(key, values);
    }
    
    // 如果都不可用，返回键名
    console.warn(`无法翻译键: ${key}，i18n 实例不可用`);
    return key;
  } catch (e) {
    console.error(`翻译键 ${key} 失败:`, e);
    return key;
  }
}

// 添加到全局 uni 对象
if (typeof uni !== 'undefined') {
  uni.t = globalTranslate;
}

export default globalTranslate; 