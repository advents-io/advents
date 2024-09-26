/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: ['node_modules', 'pnpm-lock.yaml'],
  extends: ['standard', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'multiline-ternary': 0,
    '@typescript-eslint/no-empty-interface': 'off',
  },
}
