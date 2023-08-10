// .eslintrc.js
process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@antfu',
  rules: {
    'curly': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
}
