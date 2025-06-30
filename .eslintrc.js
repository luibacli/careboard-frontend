module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
    },
    rules: {
        // example: force semicolons
        'semi': ['error', 'always'],
        // example: single quotes
        'quotes': ['error', 'single']
    }
};
  