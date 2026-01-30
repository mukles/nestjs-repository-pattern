import { nestJsConfig } from "@repo/eslint-config/nest-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["dist/**", "node_modules/**", "src/migrations/**", "test/**"],
  },
  ...nestJsConfig,
];
