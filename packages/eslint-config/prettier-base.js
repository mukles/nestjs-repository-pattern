/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */

const config = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cva', 'cn', 'clsx', 'twMerge'],
};

export default config;
