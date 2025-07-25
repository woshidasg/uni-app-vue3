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

- **企业级网络请求封装**：基于 `uni.request`，支持拦截器、Token 自动注入、全局错误处理、401 自动跳转登录等。
- **模块化状态管理**：集成 Vuex 4.x，用户信息持久化，支持多模块扩展。
- **全局路由守卫**：基于 `uni.addInterceptor`，灵活配置白名单、权限控制、防重复登录。
- **分包加载优化**：主包精简，分包预加载，提升启动速度和性能。
- **多语言国际化**：集成 vue-i18n，支持中英文切换，自动检测系统语言，TabBar 动态多语言。
- **代码规范与格式化**：内置 ESLint + Prettier，统一风格，自动格式化，提升团队协作。
- **主题与自定义导航栏**：支持明暗主题切换，自定义导航栏样式。
- **缓存与表单验证**：分包缓存策略，集成多语言表单验证。

---

## 🛠️ 技术栈

- **核心框架**：Vue 3.x + uni-app
- **状态管理**：Vuex 4.x
- **国际化**：vue-i18n 9.x
- **UI 组件**：uni-ui
- **请求库**：基于 uni.request 封装
- **代码规范**：ESLint 8.x + Prettier 3.x
- **编译工具**：Vite
- **CSS 预处理**：SCSS
- **包管理**：npm
- **运行环境**：Node.js 18.20.1+

---

## 📁 项目结构

```
.
├── api/                  # API 接口封装
│   ├── index.js          # API 接口入口
│   └── user.js           # 用户相关接口
├── common/               # 公共配置
│   └── config.js         # 全局配置文件
├── components/           # 公共组件
├── locale/               # 国际化配置
│   ├── en-US.js          # 英文语言包
│   ├── index.js          # 国际化入口
│   └── zh-CN.js          # 中文语言包
├── pages/                # 主包页面
│   ├── index/            # 首页
│   └── login/            # 登录页
├── static/               # 静态资源
├── store/                # Vuex 状态管理
│   ├── index.js          # Store 入口
│   └── modules/          # Store 模块
│       └── user.js       # 用户模块
├── sub-pages/            # 分包页面
│   └── my/               # 我的页面
├── uni_modules/          # uni-app 插件
├── utils/                # 工具函数
│   ├── auth.js           # 授权相关
│   ├── cache.js          # 缓存管理
│   ├── i18n-helper.js    # 国际化辅助
│   ├── permission.js     # 权限控制
│   ├── request.js        # 请求封装
│   ├── subpackage.js     # 分包加载
│   ├── tools.js          # 通用工具
│   └── validate.js       # 数据验证
├── App.vue               # 应用入口组件
├── main.js               # 应用入口文件
├── manifest.json         # 应用配置
├── pages.json            # 页面配置
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

### 更换/扩展 API
- 在 `api/` 目录下按模块添加接口文件，统一管理。

### 多语言配置
- 在 `locale/` 目录下维护多语言包，使用 `$t('key')` 方式调用。

### 主题切换
- 可扩展主题系统，支持明暗主题自定义。

### 分包与缓存
- 按需拆分页面到 `sub-pages/`，并结合 `utils/cache.js` 管理缓存。

### 自定义导航栏
- 登录页等可自定义导航栏样式，参考 `pages/login/` 实现。

### 表单验证
- 使用 `utils/validate.js`，支持多语言错误提示。

---

## 🏆 最佳实践

1. **API 管理**：所有接口统一在 `api` 目录下管理，按模块划分。
2. **状态管理**：全局状态放在 Vuex 中，按模块划分，避免滥用。
3. **路由守卫**：需要登录的页面添加到 `LOGIN_REQUIRED_PAGES` 配置中。
4. **多语言**：所有文本使用 `$t('key')` 的方式引用，便于国际化。
5. **分包加载**：非核心页面放入分包中，减小主包体积。

---

