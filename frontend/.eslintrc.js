module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'react-refresh'],
  rules: {
    'react/react-in-jsx-scope': 'off', // React 17+ için gerekli değil
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off', // TypeScript kullandığımız için
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};