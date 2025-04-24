import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // recommendedConfig: {
  //   // Add any recommended configurations here if needed
  // },
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

// const eslintConfig = [
//   ...compat.extends(
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'next/core-web-vitals',
//   ),
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//     languageOptions: {
//       parser: '@typescript-eslint/parser',
//       parserOptions: {
//         project: './tsconfig.json',
//       },
//     },
//     rules: {
//       // Add any custom rules here
//     },
//     ignorePatterns: [
//       'C:/Users/adria/Application Data',
//       'C:/Users/adria/Cookies',
//     ], // Exclude problematic directories
//   },
//];

export default eslintConfig;
