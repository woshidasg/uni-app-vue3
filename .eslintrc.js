module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/prettier'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/html-self-closing': ['warn', {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always'
      }
    }],
    'prettier/prettier': ['error', {
      singleQuote: true,
      semi: false,
      trailingComma: 'none',
      arrowParens: 'avoid'
    }]
  },
  globals: {
    uni: true,
    wx: true,
    plus: true,
    getCurrentPages: true,
    getApp: true
  }
} 