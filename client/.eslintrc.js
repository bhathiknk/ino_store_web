module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb',
    'plugin:jest/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'jest', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 'off', // Turn off no-console
    'no-alert': 'off', // Turn off no-alert
    'react/prop-types': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'react/button-has-type': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn', // Change unused vars to warnings
    'no-shadow': 'off',
    'react/destructuring-assignment': 'off',
    'func-names': 'off',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react/no-unstable-nested-components': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'no-case-declarations': 'off',
    'no-lone-blocks': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
