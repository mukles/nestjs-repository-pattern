import config from "@repo/eslint-config/prettier-base";

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  ...config,
  tailwindStylesheet: "./src/styles/globals.css",
};
