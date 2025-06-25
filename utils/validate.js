/**
 * 常用验证工具函数
 */

/**
 * 验证手机号
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

/**
 * 验证邮箱
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}

/**
 * 验证URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidURL(url) {
  const reg = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}(:[0-9]+)?(\/[-a-zA-Z0-9%_.~#+]*)*(\?[;&a-zA-Z0-9%_.~+=-]*)?(#[-a-zA-Z0-9%_.~+=/]*)?$/;
  return reg.test(url);
}

/**
 * 验证身份证号
 * @param {string} idCard
 * @returns {boolean}
 */
export function isValidIDCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(idCard);
}

/**
 * 验证是否为空
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
} 