// Root ESLint config for monorepo (ESLint v9+)
import { config as base } from "./packages/eslint-config/base.js";

export default [
  ...base,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/build/**",
      "**/coverage/**",
      "**/.turbo/**",
    ],
  },
];
