module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'camelcase': 'off',
    'quote-props': 'off',
    'consistent-return': 'off',
    'function-paren-newline': [2, 'consistent'],
    'max-len': [2, { code: 100 }],
    'func-names': [2, 'as-needed'],
  },
};
