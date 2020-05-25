module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  ignorePatterns: [
    'client/',
    'node_modules/',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'camelcase': 'off',
    'quote-props': 'off',
    'consistent-return': 'off',
    'function-paren-newline': [2, 'consistent'],
    'max-len': [2, { code: 100 }],
    'func-names': [2, 'as-needed'],
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
};
