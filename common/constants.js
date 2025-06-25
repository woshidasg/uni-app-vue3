/**
 * 常量定义
 */

// 响应状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// 用户角色
export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// 性别
export const GENDER = {
  MALE: 1,
  FEMALE: 2,
  UNKNOWN: 0
};

// 支付方式
export const PAYMENT_TYPE = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  BANK: 'bank'
};

// 订单状态
export const ORDER_STATUS = {
  PENDING: 0,    // 待支付
  PAID: 1,       // 已支付
  SHIPPED: 2,    // 已发货
  COMPLETED: 3,  // 已完成
  CANCELLED: -1  // 已取消
};

// 消息类型
export const MESSAGE_TYPE = {
  SYSTEM: 'system',
  ORDER: 'order',
  PROMOTION: 'promotion'
}; 