<h1 align="center">uni-app-vue3 项目模板</h1>

<p align="center">
  <strong>高效、规范、功能完备的 uni-app + Vue3 跨平台应用开发脚手架</strong>
</p>

<p align="center">
  <a href="https://github.com/woshidasg/uni-app-vue3"><img src="https://img.shields.io/github/stars/woshidasg/uni-app-vue3.svg?style=social&label=Stars" alt="GitHub stars"></a>
  <a href="https://github.com/woshidasg/uni-app-vue3/fork"><img src="https://img.shields.io/github/forks/woshidasg/uni-app-vue3.svg?style=social&label=Fork" alt="GitHub forks"></a>
  <img src="https://img.shields.io/badge/Vue-3.x-green" alt="vue">
  <img src="https://img.shields.io/badge/uni--app-supported-blue" alt="uni-app">
  <img src="https://img.shields.io/badge/Vuex-4.x-orange" alt="vuex">
  <img src="https://img.shields.io/github/license/woshidasg/uni-app-vue3" alt="license">
</p>

---

## 📖 开源信息

本仓库由 [@woshidasg](https://github.com/woshidasg) 进行开发和维护。欢迎大家 Star、Fork，并提出宝贵的意见。

---

## 📖 项目简介

uni-app-vue3 是一个高效、规范、功能完备的 uni-app 开发脚手架，为快速开发跨平台应用提供了完整的解决方案。本模板集成了多语言国际化、状态管理、路由守卫、请求封装等企业级功能，并采用分包加载策略优化性能，同时内置代码规范工具保证代码质量。

---

## ✨ 功能特性

### 核心功能
- **企业级网络请求封装**：基于 `uni.request`，支持拦截器、Token 自动注入、全局错误处理、401 自动跳转登录、智能 loading 管理、请求计数器。
- **Vite 代理配置**：开发环境使用 Vite 代理解决跨域问题，支持多环境代理配置（开发/测试/生产），代理路径自动重写。
- **统一配置管理**：`common/config.js` 统一管理 API 配置、代理配置、环境配置、路由配置等，避免配置分散。
- **统一错误码管理**：集中管理 HTTP 错误码和业务错误码，提供友好的错误提示信息。
- **模块化状态管理**：集成 Vuex 4.x，用户信息持久化，支持多模块扩展，包含用户模块和应用配置模块。
- **全局路由拦截系统**：基于 `uni.addInterceptor`，支持白名单配置、菜单权限校验、H5 登录重定向、防重复登录。
- **多环境配置管理**：支持开发、测试、生产三种环境，配置集中在 `common/config.js`，环境配置持久化。

### 工具插件
- **全局工具插件**：封装 Modal 工具（消息提示、确认框、loading）和 Tab 工具（页面跳转），统一调用方式。
- **多语言国际化**：集成 vue-i18n，支持中英文切换，自动检测系统语言，TabBar 动态多语言。
- **缓存与表单验证**：分包缓存策略，集成多语言表单验证。
- **网络状态监控**：实时监控网络连接状态，自动提示离线/在线，支持网络类型判断（WiFi/移动网络）。
- **日志管理系统**：支持日志级别控制、日志持久化、日志上报，开发/生产环境自动切换。

### 性能优化
- **分包加载优化**：主包精简，分包预加载，提升启动速度和性能。
- **图片懒加载**：`LazyImage` 组件，支持 IntersectionObserver API（H5）和原生 lazy-load（小程序/App），优化图片加载时机。
- **虚拟列表**：`VirtualList` 组件，支持 10000+ 条数据流畅滚动，只渲染可视区域内容。
- **骨架屏**：`Skeleton` 组件，提供优雅的加载占位效果，提升用户感知性能。
- **资源预加载**：智能预加载分包、页面和图片资源，支持优先级控制和网络类型判断。
- **性能监控**：实时监控 FCP、LCP、TTP、FPS 等关键性能指标，提供性能评分和优化建议。

### 开发体验
- **代码规范与格式化**：内置 ESLint + Prettier，统一风格，自动格式化，提升团队协作。
- **主题与自定义导航栏**：支持明暗主题切换，自定义导航栏样式。

---

## 🛠️ 技术栈

- **核心框架**：Vue 3.x + uni-app
- **状态管理**：Vuex 4.x
- **国际化**：vue-i18n 9.x
- **UI 组件**：uni-ui
- **请求库**：基于 uni.request 封装，支持智能 loading、错误码管理、文件上传
- **工具插件**：封装 Modal 和 Tab 工具，统一调用方式
- **错误管理**：统一错误码管理，支持 HTTP 和业务错误码映射
- **路由拦截**：全局路由守卫，支持权限校验和登录重定向
- **环境管理**：多环境配置（开发/测试/生产），运行时动态切换
- **代码规范**：ESLint 8.x + Prettier 3.x
- **开发工具**：HBuilderX（推荐）或 CLI 模式
- **CSS 预处理**：SCSS
- **包管理**：npm
- **运行环境**：Node.js 18.20.1+

---

## 📁 项目结构

```
.
├── api/                  # API 接口封装
│   └── user.js           # 用户相关接口
├── common/               # 公共配置
│   └── config.js         # 全局配置文件（API、代理、环境、路由等统一配置）
├── components/           # 公共组件
│   ├── LazyImage/        # 图片懒加载组件
│   ├── VirtualList/      # 虚拟列表组件
│   └── Skeleton/         # 骨架屏组件
├── locale/               # 国际化配置
│   ├── en-US.js          # 英文语言包
│   ├── index.js          # 国际化入口
│   └── zh-CN.js          # 中文语言包
├── pages/                # 主包页面
│   ├── index/            # 首页
│   ├── login/            # 登录页
│   └── performance-demo/ # 性能优化示例页
├── plugins/              # 插件目录
│   └── utils/            # 工具插件
│       ├── index.js      # 插件入口
│       ├── modal.js      # Modal 工具（消息提示、确认框、loading）
│       └── tab.js        # Tab 工具（页面跳转）
├── static/               # 静态资源
├── store/                # Vuex 状态管理
│   ├── index.js          # Store 入口
│   └── modules/          # Store 模块
│       ├── user.js       # 用户模块（token、userInfo、menus、permissions）
│       └── app.js        # 应用模块（环境配置管理）
├── sub-pages/            # 分包页面
│   └── my/               # 我的页面
├── uni_modules/          # uni-app 插件
├── utils/                # 工具函数
│   ├── auth.js           # 授权相关（权限校验、登录重定向）
│   ├── cache.js          # 缓存管理
│   ├── error-code.js     # 错误码管理（HTTP 错误码、业务错误码）
│   ├── i18n-helper.js    # 国际化辅助
│   ├── interceptor.js    # 路由拦截器（全局路由守卫）
│   ├── permission.js     # 权限控制
│   ├── request.js        # 请求封装（智能 loading、错误处理、文件上传）
│   ├── subpackage.js     # 分包加载
│   ├── tools.js          # 通用工具
│   ├── validate.js       # 数据验证
│   ├── performance.js    # 性能监控
│   ├── preload.js        # 资源预加载
│   ├── logger.js         # 日志管理
│   └── network.js        # 网络状态监控
├── App.vue               # 应用入口组件
├── main.js               # 应用入口文件
├── manifest.json         # 应用配置
├── pages.json            # 页面配置
├── vite.config.js        # Vite 配置（代理配置）
└── uni.scss              # 全局样式变量
```

---

## 🚀 快速上手

### 1. 环境准备

- Node.js: 18.20.1 或更高版本
- npm: 最新稳定版本

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发

```bash
npm run dev:h5        # H5 开发模式
npm run dev:mp-weixin # 微信小程序开发模式
```

### 4. 代码规范检查

```bash
npm run lint         # 检查代码规范
npm run lint:fix     # 自动修复代码规范问题
npm run format       # 格式化代码
```

### 5. 构建发布

```bash
npm run build:h5        # 构建 H5 版本
npm run build:mp-weixin # 构建微信小程序版本
```

---

## 🔧 定制化指南

### 环境配置
- 在 `env.js` 中配置不同环境的 baseUrl 和其他参数。
- 使用 `store/modules/app.js` 中的 `switchEnv` 方法切换环境。
- 环境配置会自动持久化到本地存储。

```javascript
// env.js 示例
const defaultAllEnv = {
  local: {
    name: '本地环境',
    baseUrl: 'http://localhost:3000',
    debug: true
  },
  prod: {
    name: '生产环境',
    baseUrl: 'https://api.example.com',
    debug: false
  }
};
```

### 更换/扩展 API
- 在 `api/` 目录下按模块添加接口文件，统一管理。
- 使用 `request.get/post/put/delete` 方法调用接口。
- 使用 `request.upload` 方法上传文件。

```javascript
// api/user.js 示例
import request from '@/utils/request';

export function login(data) {
  return request.post('/auth/login', data);
}

export function getUserInfo() {
  return request.get('/user/info');
}
```

### 错误码管理
- 在 `utils/error-code.js` 中维护错误码映射表。
- 支持 HTTP 错误码和业务错误码的统一管理。
- 自动显示友好的错误提示信息。

```javascript
// 添加自定义业务错误码
export const BIZ_ERROR_MAP = {
  10001: '用户名或密码错误',
  10002: '账号已被禁用',
  // 添加更多错误码...
};
```

### 路由权限配置
- 在 `common/config.js` 中配置白名单：
  - `NO_TOKEN_WHITE_LIST`: 未登录可访问的页面
  - `HAS_TOKEN_WHITE_LIST`: 已登录可访问的页面
- 菜单权限通过 `store/modules/user.js` 中的 `menus` 状态管理。
- 支持精确路径匹配和正则路径匹配。

```javascript
// 配置示例
NO_TOKEN_WHITE_LIST: [
  '/pages/login/login',
  '/pages/index/index'
],
HAS_TOKEN_WHITE_LIST: [
  '/pages/my/my',
  '/sub-pages/my/my'
]
```

### 工具插件使用
- 全局访问：`uni.$utils.modal.msg('提示信息')`
- 组件内访问：`this.$utils.tab.navigateTo('/pages/index/index')`
- 支持的方法：
  - **Modal**: `msg`, `msgSuccess`, `msgError`, `alert`, `confirm`, `loading`, `closeLoading`
  - **Tab**: `navigateTo`, `redirectTo`, `reLaunch`, `switchTab`, `navigateBack`

```javascript
// 使用示例
uni.$utils.modal.msgSuccess('操作成功');
uni.$utils.modal.confirm('确认删除？').then(() => {
  // 确认后的操作
});
uni.$utils.tab.navigateTo('/pages/detail/detail?id=1');
```

### 多语言配置
- 在 `locale/` 目录下维护多语言包，使用 `$t('key')` 方式调用。
- TabBar 和页面标题支持动态多语言切换。

```javascript
// locale/zh-CN.js
export default {
  common: {
    confirm: '确认',
    cancel: '取消'
  }
};

// 使用
this.$t('common.confirm')
```

### 主题切换
- 可扩展主题系统，支持明暗主题自定义。
- 主题配置在 `common/config.js` 中的 `THEME_CONFIG`。

### 分包与缓存
- 按需拆分页面到 `sub-pages/`，并结合 `utils/cache.js` 管理缓存。
- 使用 `utils/preload.js` 预加载分包资源。

### 自定义导航栏
- 登录页等可自定义导航栏样式，参考 `pages/login/` 实现。

### 表单验证
- 使用 `utils/validate.js`，支持多语言错误提示。

---

## 🏆 最佳实践

1. **环境管理**：使用 `env.js` 配置多环境，通过 `store/modules/app.js` 动态切换。
2. **API 管理**：所有接口统一在 `api` 目录下管理，按模块划分。
3. **错误处理**：使用 `utils/error-code.js` 统一管理错误码，提供友好提示。
4. **状态管理**：全局状态放在 Vuex 中，按模块划分（user、app），避免滥用。
5. **路由守卫**：使用 `utils/interceptor.js` 实现全局路由拦截，配置白名单和权限校验。
6. **工具插件**：使用 `uni.$utils` 统一调用工具方法，避免重复封装。
7. **请求封装**：使用 `utils/request.js` 的智能 loading 管理，避免手动控制。
8. **权限控制**：通过 `menus` 状态管理菜单权限，支持精确匹配和正则匹配。
9. **多语言**：所有文本使用 `$t('key')` 的方式引用，便于国际化。
10. **分包加载**：非核心页面放入分包中，减小主包体积。
11. **性能优化**：使用懒加载、虚拟列表、骨架屏等组件提升用户体验。

---

