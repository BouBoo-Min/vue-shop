module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    // 函数名后的空格（禁用）
    'space-before-function-paren': ['error', 'never'],
    // 缩进规范（两个空格，一倍缩进）
    'vue/script-indent': ['error', 2, {'baseIndent': 1}],
    'no-trailing-spaces': ["error", { "skipBlankLines": true }],
  },
  overrides: [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ]
}
