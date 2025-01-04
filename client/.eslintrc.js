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
    'prettier', // Ensure Prettier is last to avoid conflicts
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
    'prettier/prettier': ['warn', { endOfLine: 'auto' }], // Change to "warn" to avoid breaking builds
    'react/no-unescaped-entities': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 'off', // Allow console logs
    'no-alert': 'off', // Allow alerts
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
    'no-unused-vars': 'warn', // Turn unused vars into warnings instead of errors
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
    'react/jsx-one-expression-per-line': 'off', // Disable breaking JSX expressions
    'react/jsx-curly-newline': 'off',
    'object-curly-newline': 'off', // Disable object curly newlines rule
    'operator-linebreak': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
